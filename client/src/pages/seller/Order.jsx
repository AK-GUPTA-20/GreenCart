import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import { Package, CalendarDays, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast'; // Added missing import

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/order/seller');
            if (data.success) {
                setOrders(data.orders);
                console.log('Orders fetched:', data.orders); // Debug log
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error); // Better error logging
            toast.error(error?.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
                <div className="md:p-10 p-4 space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Seller Dashboard</h2>
                        <p className="text-gray-500">Loading orders...</p>
                    </div>
                    <div className="text-center mt-24">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
            <div className="md:p-10 p-4 space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Seller Dashboard</h2>
                    <p className="text-gray-500">Manage all your customer orders below</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center mt-24 text-gray-400">
                        <div className="animate-pulse">
                            <img
                                src={assets.box_icon}
                                alt="Empty Orders"
                                className="mx-auto w-24 h-24 mb-4 opacity-60"
                            />
                        </div>
                        <p className="text-xl text-gray-600 mb-1">No Orders Yet</p>
                        <p className="text-sm text-gray-400">
                            Once a customer places an order, it will appear here for processing.
                        </p>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div
                            key={order._id || index} // Use order._id as key for better React performance
                            className="flex flex-col md:flex-row md:items-start gap-6 p-5 max-w-5xl rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md mx-auto"
                        >
                            {/* Order Items */}
                            <div className="flex gap-4 w-full md:w-1/2">
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <img
                                                src={item.product?.image?.[0] || '/placeholder-image.jpg'} // Added fallback for missing images
                                                alt={item.product?.name || 'Product'}
                                                className="w-12 h-12 object-cover rounded-lg border"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg'; // Fallback for broken images
                                                }}
                                            />
                                            <p className="text-gray-800 font-medium text-sm md:text-base">
                                                {item.product?.name || 'Product not found'}{' '}
                                                <span className="text-emerald-600 font-semibold">
                                                    × {item.quantity}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="text-sm md:text-base text-gray-700 w-full md:w-1/3 leading-relaxed">
                                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                    <Package size={18} className="text-emerald-600" /> Shipping Address
                                </h4>
                                {order.address ? (
                                    <>
                                        <p className="text-gray-800 font-medium">
                                            {order.address.firstName} {order.address.lastName}
                                        </p>
                                        <p>{order.address.street}, {order.address.city}</p>
                                        <p>{order.address.state} - {order.address.zipcode}, {order.address.country}</p>
                                        <p className="text-gray-700 font-semibold mt-1">{order.address.phone}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Address not available</p>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="flex flex-col justify-between w-full md:w-1/5 text-sm md:text-base">
                                <div className="mb-3 space-y-2 text-gray-800">
                                    <p className="flex items-center gap-2">
                                        <Truck size={16} className="text-emerald-600" />
                                        <span className="font-bold text-gray-900">Method:</span> {order.paymentType}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CalendarDays size={16} className="text-emerald-600" />
                                        <span className="font-bold text-gray-900">Date:</span>{' '}
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CreditCard size={16} className="text-emerald-600" />
                                        <span className="font-bold text-gray-900">Payment:</span>
                                        <span
                                            className={`px-2 py-0.5 ml-1 rounded-full text-xs font-semibold ${order.isPaid
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </p>
                                </div>

                                <p className="font-bold text-2xl text-emerald-700 mt-3 md:mt-0 ">
                                    {currency}
                                    {order.amount}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;