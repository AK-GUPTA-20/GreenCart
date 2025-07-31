import React from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext();

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock',{ productId: id, inStock });
            if (data.success) {
                fetchProducts();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 from-green-50 to-white">
            <h2 className="pb-6 text-2xl font-semibold text-gray-700">All Products</h2>

            <div className="max-w-5xl w-full mx-auto bg-white/60 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl overflow-hidden">
                <table className="w-full table-auto text-sm text-left text-gray-600">
                    <thead className="bg-green-100/80 text-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Product</th>
                            <th className="px-4 py-3 font-semibold">Category</th>
                            <th className="px-4 py-3 font-semibold hidden md:table-cell">Selling Price</th>
                            <th className="px-4 py-3 font-semibold text-center">In Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => (
                            <tr
                                key={product._id}
                                className={`border-t border-gray-300/20 hover:bg-green-50 transition ${
                                    idx % 2 === 0 ? 'bg-white/50' : 'bg-white/70'
                                }`}
                            >
                                <td className="px-4 py-4 flex items-center gap-4">
                                    <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="font-medium text-gray-700 line-clamp-1">{product.name}</span>
                                </td>
                                <td className="px-4 py-4">{product.category}</td>
                                <td className="px-4 py-4 hidden md:table-cell">
                                    {currency}
                                    {product.offerPrice}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.inStock}
                                            onChange={() => toggleStock(product._id, !product.inStock)}
                                        />
                                        <div className="w-12 h-7 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-300"></div>
                                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
