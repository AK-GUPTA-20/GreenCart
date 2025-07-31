import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { currency, user, axios, addToCart, navigate } = useAppContext(); // Added addToCart and navigate

  const fetchMyOrders = async () => {
    try {
      setLoading(true); // Set loading to true when starting fetch
      // Using axios from context (which should have auth headers/cookies)
      const { data } = await axios.get('/api/order/user');
      
      if (data.success) {
        setMyOrders(data.orders);
        console.log('Orders fetched:', data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User found, fetching orders for:', user._id);
      fetchMyOrders();
    } else {
      console.log('No user found');
      setLoading(false); // Set loading to false if no user
    }
  }, [user]);

  const getEstimatedDate = (createdAt) => {
    const est = new Date(createdAt);
    est.setDate(est.getDate() + 2);
    return est.toLocaleDateString();
  };

  const handleReorder = (order) => {
    try {
      // Add all items from the order to cart
      order.items.forEach(item => {
        addToCart(item.product._id, item.quantity || 1);
      });
      
      toast.success(`${order.items.length} item(s) added to cart!`);
      
      // Navigate to cart after a brief delay
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
      
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder items');
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );

  return (
    <div className="mt-16 pb-16 px-4 md:px-16">
      {/* Header Section */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 flex justify-center items-center opacity-5">
          <div className="w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl"></div>
        </div>

        {/* Main Heading */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-600 bg-clip-text text-transparent">
              Your
            </span>
            <br className="md:hidden" />
            <span className="ml-0 md:ml-4 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              Orders
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
            Track all your{' '}
            <span className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              previous orders
            </span>{' '}
            and delivery status below
          </p>

          {/* Animated Underline */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-emerald-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
              <div className="font-bold text-green-700">Quick Delivery</div>
              <div className="text-green-600">20-30 mins</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
              <div className="font-bold text-blue-700">Order Tracking</div>
              <div className="text-blue-600">Real-time updates</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
              <div className="font-bold text-purple-700">Hygienic Handling</div>
              <div className="text-purple-600">From source to doorstep </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      {loading ? (
        <LoadingSpinner />
      ) : myOrders.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <img
            src={assets.box_icon}
            alt="No Orders"
            className="mx-auto mb-6 w-28 h-28 opacity-60"
          />
          <p className="text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl mb-10 p-6 bg-white shadow-md max-w-5xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600 font-medium mb-4 gap-2">
              <span>
                <strong className="text-gray-700">Order ID:</strong> {order._id}
              </span>
              <span>
                <strong className="text-gray-700">Payment:</strong> {order.paymentMethod || order.paymentType}
              </span>
              <span>
                <strong className="text-gray-700">Total:</strong> {currency}{order.amount}
              </span>
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row justify-between md:items-center p-4 border-t border-gray-200 ${
                  idx === 0 ? 'border-none' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Category: {item.product.category}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mt-4 md:mt-0 md:ml-8 flex flex-col gap-1">
                  <p>
                    Quantity:{' '}
                    <span className="font-medium text-gray-700">
                      {item.quantity || 1}
                    </span>
                  </p>
                  <p>
                    Date:{' '}
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    Est. Delivery:{' '}
                    <span className="text-blue-700 font-medium">
                      {getEstimatedDate(order.createdAt)}
                    </span>
                  </p>
                </div>

                <p className="text-green-700 font-bold text-lg mt-4 md:mt-0">
                  {currency}{item.product.offerPrice * (item.quantity || 1)}
                </p>
              </div>
            ))}

            {/* Reorder Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleReorder(order)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                </svg>
                Reorder
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;