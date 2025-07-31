import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import user from "../models/User.js";

//* Place Order COD: POST /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    // Create order
    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentType: "COD",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

//* Place Order Online: POST /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    let productData = [];
    let amount = 0;

    // Process each item and build product data for Stripe
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Add to total amount
      amount += product.offerPrice * item.quantity;

      // Add to product data for Stripe
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    // Create order
    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentType: "Online",
      isPaid: false,
    });

    // Initialize Stripe
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for Stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Add tax as a separate line item
    const taxAmount = Math.floor(
      ((amount * 0.02) / (amount / (amount - Math.floor(amount * 0.02)))) * 100
    );
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Tax (2%)",
        },
        unit_amount: taxAmount,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=myorders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Stripe session created successfully",
      url: session.url,
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing Stripe order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

//* Stripe Webhook to handle payment confirmation : /stripe
export const stripeWebhook = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log(`Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        // This is the correct event for successful checkout
        const session = event.data.object;
        const { orderId, userId } = session.metadata;

        console.log(`Processing successful payment for order: ${orderId}`);

        // Update order status to paid
        await Order.findByIdAndUpdate(orderId, { 
          isPaid: true,
          status: "Payment Confirmed"
        });

        // Clear cart for the user
        await user.findByIdAndUpdate(userId, { cartItems: {} });

        console.log(`Order ${orderId} marked as paid and cart cleared for user ${userId}`);
        break;
      }

      case "checkout.session.expired": {
        // Handle expired checkout sessions
        const session = event.data.object;
        const { orderId } = session.metadata;

        console.log(`Checkout session expired for order: ${orderId}`);

        
        await Order.findByIdAndUpdate(orderId, { 
          status: "Payment Failed - Session Expired" 
        });
        break;
      }

      case "payment_intent.payment_failed": {
        // Handle failed payments
        const paymentIntent = event.data.object;
        console.log(`Payment failed for payment intent: ${paymentIntent.id}`);

        // Try to find the associated session and order
        try {
          const sessions = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1
          });

          if (sessions.data.length > 0) {
            const { orderId } = sessions.data[0].metadata;
            await Order.findByIdAndUpdate(orderId, { 
              status: "Payment Failed",
              isPaid: false 
            });
            console.log(`Order ${orderId} marked as payment failed`);
          }
        } catch (error) {
          console.error("Error handling payment failure:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    res.status(200).json({ received: true });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Webhook processing failed",
      error: error.message 
    });
  }
};

//* Get Orders by User ID: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("Fetching orders for userId:", userId);

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    console.log("Found orders:", orders.length);

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//* Get ALL Orders (for seller/admin): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};