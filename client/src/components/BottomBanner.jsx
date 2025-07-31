import React from 'react';
import { assets, features } from '../assets/assets';

export default function BottomBanner() {
  return (
    <div className="relative mt-24">
      {/* Banner Image */}
      <img src={assets.bottom_banner_image} alt="banner" className="w-full hidden md:block" />
      <img src={assets.bottom_banner_image_sm} alt="banner" className="w-full md:hidden" />

      {/* Features Section Overlay */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 px-4 md:px-0">
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-green-600 mb-6 text-center md:text-right">
          Why We Are the Best?
        </h1>

        {/* Features List */}
        <div className="flex flex-col gap-5 w-full md:w-[420px]">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon Box */}
              <div className="bg-green-500 p-2.5 rounded-lg shadow-md">
                <img src={feature.icon} alt={feature.title} className="w-6 h-6" />
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
