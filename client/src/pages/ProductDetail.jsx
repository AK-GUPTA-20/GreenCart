import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCart';

const ProductDetail = () => {
  const { products, currency, navigate, addToCart } = useAppContext();
  const { category, id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const filtered = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  return product ? (
    <div className="mt-12 px-4 md:px-12">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> /
        <Link to="/products" className="hover:text-primary"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary"> {product.category}</Link> /
        <span className="text-primary font-semibold"> {product.name}</span>
      </p>

      {/* Main Product Section */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border border-gray-200 rounded-xl cursor-pointer hover:scale-105 transition backdrop-blur-sm bg-white/30 shadow-sm"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 rounded-xl max-w-sm overflow-hidden backdrop-blur-md bg-white/40 shadow-lg">
            <img
              src={thumbnail}
              alt="Selected Product"
              className="w-full h-full object-contain p-2 transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-green-700 relative w-fit pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-green-300 after:rounded-full">
            {product.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-1">
            {Array(5).fill('').map((_, i) => (
              <span key={i} className={`text-xl ${i < 4 ? 'text-green-600' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
            <p className="ml-2 text-sm text-gray-500">(4)</p>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-gray-400 line-through text-sm">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-semibold text-green-800">
              MRP: {currency}{product.offerPrice}
            </p>
            <span className="text-sm text-gray-400">(inclusive of all taxes)</span>
          </div>

          {/* Description */}
          <div>
            <p className="text-base font-medium text-gray-700">About Product</p>
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1 mt-1">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3 font-medium bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105 transition rounded-md shadow-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3 font-medium bg-primary text-white hover:bg-primary-dull hover:scale-105 transition rounded-md shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-30 px-4 md:px-12">
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-green-700">Related Products</p>
          <div className="w-16 h-0.5 mx-auto bg-primary mt-1 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              navigate('/products');
              scrollTo(0, 0);
            }}
            className="px-6 py-2 border border-green-500 text-green-700 rounded hover:bg-green-100 hover:scale-105 transition shadow"
          >
            See More
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProductDetail;
