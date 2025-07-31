import React from 'react';

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-8 space-y-4 bg-white mt:30 pb-14">
            <h1 className="text-2xl md:text-4xl font-bold text-black-700">Never Miss a Deal!</h1>
            <p className="text-sm md:text-lg text-gray-500">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>

            <form className="w-full max-w-2xl flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-2">
                <input
                    type="email"
                    required
                    placeholder="Enter your email id"
                    className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                    type="submit"
                    className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md font-medium shadow-sm transition-all duration-300"
                >
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default NewsLetter;
