import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { data, Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';


const SellerLayout = () => {
  const { axios, navigate } = useAppContext();
  const location = useLocation();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try{
      const {data} = await axios.get('/api/seller/logout');
      if(data.success){
        toast.success(data.message);
        navigate('/');
        
      } else {
        toast.error(data.message || "Logout failed, please try again.");
      }
    }catch{
      toast.error(data.message || "Logout failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-3 flex justify-between items-center">
        <Link to="/">
          <img src={assets.logo} alt="GreenCart Logo" className="w-32 md:w-36" />
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">Hi, Admin</span>
          <button
            onClick={logout}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full transition duration-300 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-white w-16 md:w-64 border-r border-gray-200 py-6 px-2 md:px-4 space-y-4 transition-all duration-300">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-emerald-100 text-emerald-700 font-semibold border-r-4 border-emerald-500'
                  : 'hover:bg-gray-100 text-gray-600'
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span className="hidden md:inline text-sm">{item.name}</span>
            </NavLink>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
