import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { categories } from '../assets/assets';
import ProductCart from '../components/ProductCart';
const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-center w-full mt-10">
          <div className="relative group inline-block">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 transition-all duration-300 group-hover:font-bold">
              {searchCategory.text}
            </h2>
            <span className="block mx-auto mt-1 h-0.5 bg-primary rounded-full transition-all duration-500 ease-in-out w-10 group-hover:w-full"></span>
          </div>
          <p className="mt-2 text-gray-500 text-sm">
            Explore our selection of {searchCategory.text.toLowerCase()}
          </p>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCart key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-gray-500">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
