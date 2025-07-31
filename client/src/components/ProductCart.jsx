import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const ProductCart = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();
  const navigate = useNavigate();


  return product && (
    <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });}}
      className="relative group cursor-pointer rounded-xl overflow-hidden border !border-gray-300"
    >
      {/* Decorative blurred green light effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="w-full h-full bg-gradient-to-br from-green-100 via-green-200 to-green-150 opacity-20 blur-sm" />
      </div>

      <div className="relative z-10 md:px-4 px-3 py-3">
        {/* Product Image */}
        <div className="flex items-center justify-center px-2">
          <img className="group-hover:scale-105 transition max-w-28 md:max-w-36" src={product?.image?.[0] || assets.default_image} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="text-gray-600 text-sm mt-2">
          <p>{product.category}</p>
          <p className="text-gray-800 font-semibold text-lg truncate">{product.name}</p>

          {/* Ratings */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill('').map((_, i) => (
              <img key={i} className='w-3.5' src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" />
            ))}
            <p className="text-xs ml-1">(4)</p>
          </div>

          {/* Price & Cart */}
          <div className="flex items-end justify-between mt-3">
            <p className="text-green-700 font-semibold text-base md:text-xl">
              {currency}{product.offerPrice}{" "}
              <span className="text-gray-400 line-through text-sm">${product.price}</span>
            </p>

            <div onClick={(e) => e.stopPropagation()} className="text-primary">
              {!cartItems[product._id] ? (
                <button
                  className="bg-green-100 text-green-600 border border-green-400 font-medium overflow-hidden relative px-4 py-2 rounded-md
                  hover:brightness-105 outline-none duration-300 group"
                  onClick={() => addToCart(product._id)}
                >
                  <span className="bg-green-400 shadow-green-300 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md 
                  opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.1)]" />
                  <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4 inline mr-1" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-green-200/50 rounded select-none">
                  <button onClick={() => removeFromCart(product._id)} className="text-md px-2 h-full font-bold">-</button>
                  <span className="w-5 text-center">{cartItems[product._id]}</span>
                  <button onClick={() => addToCart(product._id)} className="text-md px-2 h-full font-bold">+</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
