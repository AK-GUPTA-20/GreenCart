import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Cart = () => {
    const [showAddress, setShowAddress] = useState(false);
    const { products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, user, axios, setCartItems } = useAppContext();
    const [cartArray, setCartArray] = useState([]);
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Add loading state for order placement
    const location = useLocation();

    // Promo code states
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoDiscount, setPromoDiscount] = useState(0);

    // Progress calculation function
    const getProgress = () => {
        let progress = 25; // Base progress for cart (step 1)
        
        if (selectedAddress) {
            progress = 50; // Step 2: Address selected
        }
        
        if (selectedAddress && paymentMethod) {
            progress = 75; // Step 3: Payment method selected
        }
        
        return progress;
    };

    const handlePromoCode = () => {
        const trimmedCode = promoCode.trim().toUpperCase();

        if (!trimmedCode) {
            toast.error("Please enter a promo code");
            return;
        }

        if (trimmedCode === "CART11") {
            if (appliedPromo === "CART11") {
                toast.info("Promo code already applied!");
                return;
            }

            const discount = getCartAmount() * 0.11; // 11% discount
            setAppliedPromo("CART11");
            setPromoDiscount(discount);
            toast.success("🎉 Promo code applied! 11% discount added");
        } else {
            toast.error("Invalid promo code");
        }
    };

    const removePromoCode = () => {
        setAppliedPromo(null);
        setPromoDiscount(0);
        setPromoCode('');
        toast.success("Promo code removed");
    };

    const calculateFinalAmount = () => {
        const subtotal = getCartAmount();
        const tax = subtotal * 0.02;
        const total = subtotal + tax - promoDiscount;
        return Math.max(total, 0); // Ensure total doesn't go negative
    };

    const placeOrder = async () => {
        // Prevent multiple clicks
        if (isPlacingOrder) {
            return;
        }

        try {
            if (!selectedAddress) {
                return toast.error("Please select an address");
            }

            setIsPlacingOrder(true); // Set loading state

            // Prepare order data
            const orderData = {
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id
            };

            // Place Order with COD
            if (paymentMethod === "COD") {
                const { data } = await axios.post('/api/order/cod', orderData);
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/myorders');
                } else {
                    toast.error(data.message || 'Failed to place order');
                }
            }
            // Place Order with Stripe
            else if (paymentMethod === "Online") {
                const { data } = await axios.post('/api/order/stripe', orderData);
                if (data.success && data.url) {
                    setCartItems({});
                    window.location.href = data.url;
                } else {
                    toast.error(data.message || 'Failed to create payment session');
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error?.response?.data?.message || 'Failed to place order');
        } finally {
            setIsPlacingOrder(false); // Reset loading state
        }
    };

    //* Load addresses when component mounts
    const loadAddresses = async () => {
        if (!user) {
            console.log("No user found, cannot load addresses");
            return;
        }

        setLoadingAddresses(true);
        try {
            console.log("Loading addresses for user:", user._id);
            const { data } = await axios.get('/api/address/get');
            console.log("Address API response:", data);

            if (data.success && Array.isArray(data.data)) {
                setAddress(data.data);
                console.log("Addresses loaded:", data.data);

                if (data.data.length > 0 && !selectedAddress) {
                    setSelectedAddress(data.data[0]);
                    console.log("Selected first address:", data.data[0]);
                }
            } else {
                console.log("No addresses found or invalid response");
                setAddress([]);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Failed to load addresses');
            setAddress([]);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    //* Load addresses when user changes or component mounts
    useEffect(() => {
        if (user) {
            console.log("User found, loading addresses...");
            loadAddresses();
        } else {
            console.log("No user, clearing addresses");
            setAddress([]);
            setSelectedAddress(null);
        }
    }, [user]);

    //* Refresh addresses when coming from add-address page
    useEffect(() => {
        if (location.pathname === '/cart' && user) {
            loadAddresses();
        }
    }, [location.pathname, user]);

    if (getCartCount() === 0) {
        return (
            <div className="text-center py-20 text-green-700">
                <ShoppingCartIcon className="mx-auto w-24 h-24 text-green-500" />
                <h2 className="text-black font-semibold mt-4">Your cart is empty!</h2>
                <button onClick={() => navigate('/products')} className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Browse Products
                </button>
            </div>
        );
    }

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16 gap-8 relative pb-32 md:pb-8">

            <img src={assets.leaf_icon} className="absolute top-2 right-2 w-12 opacity-20 animate-pulse" alt="Leaf" />

            <div className='flex-1 max-w-4xl bg-green-50/30 p-4 md:p-6 rounded-xl shadow-md border border-green-200 backdrop-blur-md'>
                {/* Checkout Step Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4 text-xs md:text-sm font-semibold text-green-800">
                        <span className={`${getProgress() >= 25 ? 'text-green-600' : 'text-gray-400'}`}>1. Cart</span>
                        <span className={`${getProgress() >= 50 ? 'text-green-600' : 'text-gray-400'}`}>2. Address</span>
                        <span className={`${getProgress() >= 75 ? 'text-green-600' : 'text-gray-400'}`}>3. Payment</span>
                        <span className="text-gray-400">4. Done</span>
                    </div>
                    <div className="w-full h-2 bg-green-200 rounded">
                        <div 
                            className="h-2 bg-green-600 rounded transition-all duration-500 ease-in-out" 
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
                    Shopping Cart <span className="text-sm md:text-base text-green-600">({getCartCount()})</span>
                </h1>

                {/* Desktop Grid Headers */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-green-700 text-base font-semibold border-b border-green-300 pb-3">
                    <p>Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {/* Mobile and Desktop Cart Items */}
                {cartArray.map((product, index) => (
                    <div key={index}>
                        {/* Desktop View */}
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-green-900 items-center text-sm md:text-base font-medium py-4 border-b border-green-100">
                            <div className="flex items-center md:gap-6 gap-3">
                                <div onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });

                                }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-green-300 bg-white rounded-xl hover:shadow-md">
                                    <img className="max-w-full h-full object-cover rounded" src={product.image[0]} alt={product.name} />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-900">{product.name}</p>
                                    <p className="text-green-700 text-sm">Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center mt-1'>
                                        <p className='text-sm'>Qty:</p>
                                        <select
                                            onChange={e => updateCartItem(product._id, Number(e.target.value))}
                                            value={cartItems[product._id]}
                                            className='ml-2 border border-green-300 rounded px-2 py-1 text-green-800 bg-white focus:outline-green-400'>
                                            {Array.from({ length: Math.max(9, cartItems[product._id]) }, (_, i) => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-green-800 font-semibold">{currency}{product.offerPrice * product.quantity}</p>
                            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                                <img src={assets.remove_icon} alt="remove" className='w-6 h-6 hover:scale-110 transition-transform' />
                            </button>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden bg-white border border-green-200 rounded-lg p-4 mb-4 shadow-sm">
                            <div className="flex gap-3">
                                <div onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className="cursor-pointer w-20 h-20 flex items-center justify-center border border-green-300 bg-white rounded-lg hover:shadow-md flex-shrink-0">
                                    <img className="max-w-full h-full object-cover rounded" src={product.image[0]} alt={product.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-green-900 text-sm truncate">{product.name}</p>
                                    <p className="text-green-700 text-xs mt-1">Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className='flex items-center'>
                                            <p className='text-xs text-green-700'>Qty:</p>
                                            <select
                                                onChange={e => updateCartItem(product._id, Number(e.target.value))}
                                                value={cartItems[product._id]}
                                                className='ml-2 border border-green-300 rounded px-2 py-1 text-xs text-green-800 bg-white focus:outline-green-400'>
                                                {Array.from({ length: Math.max(9, cartItems[product._id]) }, (_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-green-800 font-semibold text-sm">{currency}{product.offerPrice * product.quantity}</p>
                                            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer">
                                                <img src={assets.remove_icon} alt="remove" className='w-5 h-5 hover:scale-110 transition-transform' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button onClick={() => {
                    navigate("/products");
                    scrollTo(0, 0);
                }} className="mt-8 flex items-center gap-2 text-green-700 hover:text-green-900 font-medium w-full justify-center md:justify-start">
                    <img className='w-4 h-4 rotate-180' src={assets.arrow_right_icon_colored} alt="Back" />
                    Continue Shopping
                </button>
            </div>

            {/* Order Summary - Desktop Sidebar / Mobile Fixed Bottom */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-4 md:p-5 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:shadow-lg max-md:rounded-t-2xl max-md:max-w-none border border-gray-300/70 rounded-xl shadow-lg backdrop-blur-md">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Order Summary</h2>

                {/* Promo Code Input - Hidden on mobile to save space */}
                <div className="mt-4 hidden md:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Promo Code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full px-3 py-2 border border-green-400 bg-white rounded text-sm pr-20"
                            disabled={appliedPromo}
                        />
                        {appliedPromo && (
                            <button
                                onClick={removePromoCode}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 text-xs"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    {appliedPromo ? (
                        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-green-800 font-medium">✅ {appliedPromo} Applied</span>
                                <span className="text-green-600 font-semibold">-{currency}{promoDiscount.toFixed(2)}</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handlePromoCode}
                            className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                        >
                            Apply
                        </button>
                    )}
                </div>
                <hr className="border-green-300 my-5 hidden md:block" />

                {/*Address Section */}
                <div className="mb-6">
                    <p className="text-xs md:text-sm font-bold text-gray-800 uppercase mb-2">Delivery Address</p>

                    {loadingAddresses ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading addresses...
                        </div>
                    ) : (
                        <div className="relative flex justify-between items-start mt-2 text-green-700">
                            <div className="flex-1 pr-2">
                                {selectedAddress ? (
                                    <div className="text-xs md:text-sm">
                                        <p className="font-medium text-gray-800">
                                            {selectedAddress.firstName} {selectedAddress.lastName}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            {selectedAddress.street}, {selectedAddress.city}
                                        </p>
                                        <p className="text-gray-600">
                                            {selectedAddress.state}, {selectedAddress.country} - {selectedAddress.zipCode}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            📞 {selectedAddress.phone}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs md:text-sm text-red-600">
                                        {address.length === 0 ? "No address found" : "Please select an address"}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setShowAddress(!showAddress)}
                                className="text-green-600 hover:underline cursor-pointer text-xs md:text-sm whitespace-nowrap ml-2"
                            >
                                {address.length > 0 ? "Change" : "Add"}
                            </button>
                        </div>
                    )}

                    {/* Address Dropdown */}
                    {showAddress && (
                        <div className="absolute top-12 z-20 bg-white border border-green-200 text-xs md:text-sm w-full shadow-lg max-h-40 overflow-y-auto rounded-md">
                            {address.length > 0 ? (
                                address.map((addr, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setShowAddress(false);
                                        }}
                                        className="p-3 hover:bg-green-50 cursor-pointer border-b border-green-100 last:border-b-0"
                                    >
                                        <p className="font-medium text-gray-800">
                                            {addr.firstName} {addr.lastName}
                                        </p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            {addr.street}, {addr.city}, {addr.state}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="p-3 text-gray-600 text-center">No addresses available</p>
                            )}
                            <div
                                onClick={() => {
                                    setShowAddress(false);
                                    navigate("/add-address");
                                }}
                                className="text-green-700 text-center cursor-pointer p-3 hover:bg-green-50 border-t border-green-200 font-medium"
                            >
                                + Add New Address
                            </div>
                        </div>
                    )}

                    <p className="text-xs md:text-sm font-bold text-gray-800 uppercase mt-4 md:mt-6 mb-2">Payment Method</p>
                    <select
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border border-green-300 bg-white px-3 py-2 rounded text-xs md:text-sm text-gray-800 focus:outline-green-400">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-green-300" />

                <div className="text-green-800 mt-4 space-y-2">
                    <p className="flex justify-between text-xs md:text-sm">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between text-xs md:text-sm">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    {appliedPromo && (
                        <p className="flex justify-between text-xs md:text-sm text-green-600">
                            <span>Discount ({appliedPromo})</span><span>-{currency}{promoDiscount.toFixed(2)}</span>
                        </p>
                    )}
                    <p className="flex justify-between text-xs md:text-sm">
                        <span>Tax (2%)</span><span>{currency}{(getCartAmount() * 2 / 100).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-base md:text-lg font-bold mt-3">
                        <span>Total:</span><span>{currency}{calculateFinalAmount().toFixed(2)}</span>
                    </p>
                </div>

                <p className="text-xs text-green-700 mt-4 text-center italic hidden md:block">
                    Estimated delivery: 20 to 30 min...
                </p>

                <button
                    onClick={placeOrder}
                    disabled={!selectedAddress || isPlacingOrder}
                    className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md shadow-md transition text-sm md:text-base flex items-center justify-center gap-2"
                >
                    {isPlacingOrder ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {paymentMethod === "COD" ? "Placing Order..." : "Processing..."}
                        </>
                    ) : (
                        paymentMethod === "COD" ? "Place Order" : "Proceed to Pay"
                    )}
                </button>
            </div>
        </div>
    ) : null;
};

export default Cart;