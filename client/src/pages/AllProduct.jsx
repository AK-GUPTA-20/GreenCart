import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCart from '../components/ProductCart';

export const AllProduct = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-20 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="flex flex-col items-center w-full">
        <div className="relative group inline-block">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 transition-all duration-300 group-hover:font-bold">
            All Products
          </h2>
          <span className="block mx-auto mt-2 h-0.5 bg-primary rounded-full transition-all duration-500 ease-in-out w-16 group-hover:w-full"></span>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Explore our full range of offerings</p>
      </div>

      {/* Product List or No Result */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-8 mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.filter(p => p.inStock).map((product, index) => (
            <ProductCart key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-lg">
            No products found for "<strong>{searchQuery}</strong>"
          </p>
        </div>
      )}
    </div>
  );
};

export default AllProduct;
