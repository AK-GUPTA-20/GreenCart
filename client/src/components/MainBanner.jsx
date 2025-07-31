import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

function MainBanner() {
  return (
    <div className='relative w-full'>
      {/* Background Images */}
      <img src={assets.main_banner_bg} alt="Banner" className='w-full h-auto hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="Banner" className='w-full h-auto md:hidden' />

      {/* Overlay Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center space-y-6 px-4">

        {/* Enhanced Animated Gradient Heading with Multiple Effects */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-green-500/40 to-teal-500/30 blur-2xl rounded-full opacity-60 animate-pulse"></div>
          
          {/* Main heading with enhanced styling */}
          <h1 className="relative text-3xl md:text-6xl font-black leading-tight tracking-tight">
            {/* First line with special effects */}
            <span className="block mb-2">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 text-transparent bg-clip-text drop-shadow-2xl font-black">
                Freshness
              </span>{' '}
              <span className="bg-gradient-to-r from-slate-700 via-gray-600 to-slate-800 text-transparent bg-clip-text font-black">
                You Can
              </span>{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-transparent bg-clip-text font-black animate-pulse">
                  Trust
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-70"></div>
              </span>
            </span>
            
            {/* Second line with different styling */}
            <span className="block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-transparent bg-clip-text font-black">
                You Will
              </span>{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 text-transparent bg-clip-text font-black">
                  Love!
                </span>
                {/* Heart emoji with animation */}
                <span className="absolute -top-2 -right-8 text-2xl md:text-4xl animate-bounce">💚</span>
              </span>
            </span>
          </h1>

          {/* Decorative elements */}
          <div className="absolute -top-6 left-1/4 w-6 h-6 bg-green-400 rounded-full opacity-60 animate-ping hidden md:block"></div>
          <div className="absolute -bottom-4 right-1/4 w-4 h-4 bg-emerald-500 rounded-full opacity-40 animate-ping hidden md:block" style={{animationDelay: '0.5s'}}></div>
          
          {/* Subtitle with enhanced styling */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-sm md:text-lg text-white/90 font-medium bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20"
          >
            ✨ Premium Quality • Farm Fresh • Delivered Daily ✨
          </motion.p>
        </motion.div>

        {/* Enhanced Buttons with more styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-4 justify-center"
        >

          {/* Enhanced Shop Now Button */}
          <Link
            to="/products"
            className="group relative flex items-center gap-2 px-7 md:px-9 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transform-gpu"
          >
            <span className="relative z-10">🛒 Shop Now</span>
            <img
              className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-125"
              src={assets.white_arrow_icon}
              alt="Arrow"
            />
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Enhanced Explore Deals Button */}
          <Link
            to="/products"
            className="group relative hidden md:flex items-center gap-2 px-9 py-3 bg-white/95 backdrop-blur-sm text-emerald-700 border-2 border-emerald-500 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600 transition-all duration-300 rounded-xl overflow-hidden hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] font-bold transform-gpu"
          >
            <span className="relative z-10">🔥 Explore Deals</span>
            <img
              className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-125"
              src={assets.black_arrow_icon}
              alt="Arrow"
            />
            {/* Enhanced bottom line animation */}
            <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-emerald-600 to-green-700 transition-all duration-300 group-hover:w-full"></span>
            {/* Side sparkle effect */}
            <div className="absolute top-1/2 -left-2 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 group-hover:translate-x-4"></div>
          </Link>

        </motion.div>

        {/* Additional floating elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/4 right-10 w-2 h-2 bg-pink-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;