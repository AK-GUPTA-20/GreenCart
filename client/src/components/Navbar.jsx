import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Navbar() {
    const [open, setOpen] = React.useState(false);
    const { user, setUser, setShowUserLogin, setSearchQuery, searchQuery, getCartCount, getCartAmount, axios } = useAppContext();
    const navigate = useNavigate();

    const navLinkStyle = `relative text-gray-700 hover:text-primary-dull transition-all duration-200 ease-in-out font-medium 
        after:absolute after:w-0 after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 
        hover:after:w-full after:transition-all after:duration-300`;

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if (data.success) {
                toast.success(data.message);
                setUser(null);
                setSearchQuery('');
                navigate('/');
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        navigate('/products'); 
    };

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 shadow-md bg-white relative z-50">
            {/* Logo */}
            <NavLink to="/" onClick={() => { setOpen(false); setSearchQuery(''); }} className="flex items-center">
                <img className="w-32" src={assets.logo} alt="Logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/" className={navLinkStyle}>Home</NavLink>
                <NavLink to="/products" className={navLinkStyle}>Products</NavLink>
                <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>

                {/* Search Bar */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-4 rounded-full bg-gray-100 focus-within:ring-2 ring-primary transition">
                    <input
                        onChange={handleSearch}
                        value={searchQuery}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Cart */}
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer hover:scale-105 transition-transform duration-200">
                    <img src={assets.nav_cart_icon} alt="Cart" className="w-6 h-6 " />
                    <button className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {getCartCount()}
                    </button>
                </div>

                {/* Login or Profile */}
                {!user ? (
                    <button onClick={() => setShowUserLogin(true)} className="px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full shadow-sm hover:shadow-md">
                        Login
                    </button>
                ) : (
                    <div className="relative group cursor-pointer hover:scale-105 transition">
                        <img src={assets.profile_icon} alt="Profile" className="w-12 h-11.8 rounded-full border-2 border-transparent group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300" />

                        {/* Cool Animated Name Tooltip */}

                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-2
                            opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none z-50 max-w-[70vw]">

                            <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-3 py-1.5 rounded-xl shadow-md text-sm border border-white/10
                                before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:-translate-x-full
                                before:border-[8px] before:border-transparent before:border-r-purple-500">

                                <span className="font-semibold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent whitespace-nowrap text-sm tracking-wide">
                                    I am {user.name}
                                </span>
                            </div>
                        </div>


                        {/* Profile Dropdown Menu */}
                        <ul className="absolute right-0 top-12 bg-white shadow-lg border border-gray-200 py-2.5 w-40 rounded-md z-40 text-sm 
                            opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-top-right pointer-events-none group-hover:pointer-events-auto">
                            <li onClick={() => navigate('/myorders')} className="px-4 py-2 hover:bg-primary/10 cursor-pointer">My Orders</li>
                            <li onClick={logout} className="px-4 py-2 hover:bg-primary/10 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile Hamburger */}
            <div className="sm:hidden flex items-center gap-6">
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer hover:scale-105 transition-transform duration-200">
                    <img src={assets.nav_cart_icon} alt="Cart" className="w-6 h-6 " />
                    <button className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {getCartCount()}
                    </button>
                </div>

                {/* Mobile Profile with Name Tooltip */}
                {user && (
                    <div className="relative group">
                        <img src={assets.profile_icon} alt="Profile" className="w-8 h-8 rounded-full border border-gray-300" />

                        {/* Mobile-Friendly Tooltip */}
                     
                        <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2
                        opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-50 pointer-events-none">

                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-xl shadow-lg text-xs border border-white/30
                                    before:content-[''] before:absolute before:top-0 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-full
                                    before:border-[6px] before:border-transparent before:border-b-indigo-500">

                                {/* Optional background shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/20 to-yellow-300/20 rounded-xl"></div>

                                {/* Text */}
                                <span className="relative font-bold whitespace-nowrap bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent text-sm">
                                    ✨ I am {user.name}
                                </span>

                                {/* Small glowing dot */}
                                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>


                    </div>
                )}

                <button onClick={() => setOpen(!open)} aria-label="Menu" className=" focus:outline-none">
                    <img src={assets.menu_icon} alt="Menu" className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-4 px-5 text-sm sm:hidden transition-all duration-300 z-40 flex">
                    <NavLink to="/" onClick={() => { setOpen(false); setSearchQuery(''); }} className={navLinkStyle}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)} className={navLinkStyle}>All Products</NavLink>
                    {user && (
                        <NavLink to="/myorders" onClick={() => setOpen(false)} className={navLinkStyle}>My Orders</NavLink>
                    )}
                    <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkStyle}>Contact</NavLink>

                    {!user ? (
                        <button onClick={() => { setOpen(false); setShowUserLogin(true); }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full text-center">
                            Login
                        </button>
                    ) : (
                        <button onClick={logout}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full text-center">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;