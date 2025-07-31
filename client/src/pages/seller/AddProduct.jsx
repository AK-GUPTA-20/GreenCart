import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';


const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [offerPrice, setOfferPrice] = useState(0);


    const { axios } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const validFiles = files.filter(file => file !== undefined && file !== null);
            if (validFiles.length === 0) {
                toast.error("Please upload at least one product image.");
                setLoading(false);
                return;
            }

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));

            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append('images', files[i]);
                }
            }


            const { data } = await axios.post('/api/product/add', formData);
            if (data.success) {
                toast.success(data.message);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            }
            else {
                toast.error(data.message || "Failed to add product, please try again.");

            }

        } catch (error) {
            toast.error(data.message || "Failed to add product, please try again.");
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="no-scrollbar flex-1 h-auto overflow-y-auto flex flex-col justify-start">

            <form
                onSubmit={onSubmitHandler}
                className="md:p-10 p-4 space-y-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-200"
            >
                <h2 className="text-2xl font-semibold text-green-700 mb-2">Add New Product</h2>

                <div>
                    <p className="text-base font-medium text-gray-700">Product Images <span className="text-red-500">*</span></p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        {Array(4)
                            .fill('')
                            .map((_, index) => (
                                <label key={index} htmlFor={`image${index}`}>
                                    <input
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}

                                    />
                                    <div className="w-24 h-24 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-md transition">
                                        <img
                                            src={
                                                files[index]
                                                    ? URL.createObjectURL(files[index])
                                                    : assets.upload_area
                                            }
                                            alt="upload"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </label>
                            ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="product-name" className="text-base font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        id="product-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Fresh Spinach, Tomatoes..."
                        className="outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:ring-2 ring-green-500/50"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="product-description" className="text-base font-medium text-gray-700">
                        Product Description
                    </label>
                    <textarea
                        id="product-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a short and clear description..."
                        className="outline-none py-2.5 px-4 rounded-lg border border-gray-300 resize-none focus:ring-2 ring-green-500/50"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category" className="text-base font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:ring-2 ring-green-500/50"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option value={item.path} key={index}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                        <label htmlFor="product-price" className="text-base font-medium text-gray-700">
                            Product Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="₹0"
                            className="outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:ring-2 ring-green-500/50"
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                        <label htmlFor="offer-price" className="text-base font-medium text-gray-700">
                            Offer Price
                        </label>
                        <input
                            id="offer-price"
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="₹0"
                            className="outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:ring-2 ring-green-500/50"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-md"

                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
