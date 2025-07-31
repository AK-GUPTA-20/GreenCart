import User from "../models/User.js";

//* Update cart: post /api/cart/update
export const updateCart = async (req, res) => {
  try {
    // Use the authenticated user ID from middleware instead of req.body
    const userId = req.userId; // This comes from authUser middleware
    const { cartItems } = req.body;

    // Validate cartItems
    if (!cartItems || typeof cartItems !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid cart items provided" 
      });
    }

    // Update user's cart in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Cart updated successfully",
      cartItems: updatedUser.cartItems 
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating cart", 
      error: error.message 
    });
  }
};

//* Get cart: get /api/cart/get
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId).select('cartItems');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      cartItems: user.cartItems || {} 
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching cart", 
      error: error.message 
    });
  }
};