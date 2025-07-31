import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers['Content-Type'] = 'application/json';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || 'USD';
  const navigate = useNavigate();

  // State management
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    user: false,
    seller: false,
    products: false,
    cart: false
  });

  const updateLoading = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  //* Fetch Seller Status
  const fetchSeller = useCallback(async () => {
    updateLoading('seller', true);
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      setIsSeller(data.success || false);
    } catch (error) {
      console.error('Error fetching seller status:', error);
      setIsSeller(false);
    } finally {
      updateLoading('seller', false);
    }
  }, []);

  //* Fetch cart data from database
  const fetchCartFromDB = useCallback(async () => {
    if (!user) {
      setCartItems({});
      return;
    }
    
    updateLoading('cart', true);
    try {
      const { data } = await axios.get('/api/cart/get');
      if (data.success) {
        setCartItems(data.cartItems || {});
      } else {
        if (user?.cartItems) {
          setCartItems(user.cartItems);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (user?.cartItems) {
        setCartItems(user.cartItems);
      } else {
        setCartItems({});
      }
    } finally {
      updateLoading('cart', false);
    }
  }, [user]);

  //* Fetch User Auth Status and data
  const fetchUser = useCallback(async () => {
    updateLoading('user', true);
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setCartItems({});
    } finally {
      updateLoading('user', false);
    }
  }, []);

  //* Fetch products
  const fetchProducts = useCallback(async () => {
    updateLoading('products', true);
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        throw new Error(data.message || "Invalid response format");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch products, please try again.");
      setProducts([]);
    } finally {
      updateLoading('products', false);
    }
  }, []);

  //* Add products to cart
  const addToCart = useCallback((itemId, quantity = 1) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    if (!user) {
      toast.error("Please login to add items to cart");
      setShowUserLogin(true);
      return;
    }
    const product = products.find(p => p._id === itemId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    setCartItems(prevCart => {
      const newCart = { ...prevCart };
      newCart[itemId] = (newCart[itemId] || 0) + quantity;
      return newCart;
    });

    toast.success(`${quantity > 1 ? `${quantity} items` : 'Item'} added to cart`);
  }, [user, products]);

  //* Update cart items
  const updateCartItem = useCallback((itemId, quantity) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }
    if (!user) {
      toast.error("Please login to manage cart");
      return;
    }
    if (quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    setCartItems(prevCart => {
      const newCart = { ...prevCart };
      if (quantity > 0) {
        newCart[itemId] = quantity;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });

    toast.success("Cart updated");
  }, [user]);


  //* Remove item from cart
  const removeFromCart = useCallback((itemId, quantity = 1) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    if (!user) {
      toast.error("Please login to manage cart");
      return;
    }

    setCartItems(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId]) {
        newCart[itemId] = Math.max(0, newCart[itemId] - quantity);
        if (newCart[itemId] === 0) {
          delete newCart[itemId];
        }
        return newCart;
      } else {
        toast.error("Item not found in cart");
        return prevCart;
      }
    });

    toast.success("Item removed from cart");
  }, [user]);


  //* Clear entire cart
  const clearCart = useCallback(() => {
    if (!user) {
      toast.error("Please login to manage cart");
      return;
    }
    setCartItems({});
    toast.success("Cart cleared");
  }, [user]);


  //* Get total cart count
  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  }, [cartItems]);


  //* Get total cart amount
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    
    for (const [itemId, quantity] of Object.entries(cartItems)) {
      if (quantity > 0) {
        const product = products.find(product => product._id === itemId);
        if (product && product.offerPrice) {
          totalAmount += product.offerPrice * quantity;
        }
      }
    }
    
    return Math.round(totalAmount * 100) / 100; // Round to 2 decimal places
  }, [cartItems, products]);

  
  //* Update cart in database
  const updateCartInDB = useCallback(async (cartData) => {
    if (!user) return;

    updateLoading('cart', true);
    try {
      const { data } = await axios.post('/api/cart/update', { cartItems: cartData });
      if (!data.success) {
        toast.error(data.message || 'Failed to update cart');
        // Try to fetch current cart state from DB
        await fetchCartFromDB();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error?.response?.data?.message || 'Failed to update cart');
      try {
        await fetchCartFromDB();
      } catch (fetchError) {
        console.error('Error fetching cart after update failure:', fetchError);
      }
    } finally {
      updateLoading('cart', false);
    }
  }, [user, fetchCartFromDB]);


  //* Logout user
  const logout = useCallback(async () => {
    try {
      await axios.post('/api/user/logout');
      setUser(null);
      setCartItems({});
      setIsSeller(false);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Error during logout");
    }
  }, [navigate]);


  //* Initial data fetch
  useEffect(() => {
    const initializeApp = async () => {
      await fetchUser();
      await Promise.all([
        fetchProducts(),
        fetchSeller()
      ]);
    };

    initializeApp();
  }, [fetchUser, fetchProducts, fetchSeller]);
  useEffect(() => {
    if (user) {
      fetchCartFromDB();
    } else {
      setCartItems({});
    }
  }, [user, fetchCartFromDB]);


  //* Update cart in database when cartItems change (with debouncing)
  useEffect(() => {
    let timeoutId;

    if (user && Object.keys(cartItems).length > 0) {
      timeoutId = setTimeout(() => {
        updateCartInDB(cartItems);
      }, 1000); 
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [cartItems, user, updateCartInDB]);


  //* Context value
  const value = {
    // User & Auth
    user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, logout,

    // Navigation
    navigate,
    
    // Products
    products, setProducts, fetchProducts,

    // Cart
    cartItems, setCartItems, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount, getCartAmount, fetchCartFromDB,

    // Search
    searchQuery, setSearchQuery,

    // Utils
    currency,
    loading,
    
    // API
    axios
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};



// Export 
export { AppContext, AppContextProvider, useAppContext };