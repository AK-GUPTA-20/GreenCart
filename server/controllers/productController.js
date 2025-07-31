import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

//* Add product:  /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imageUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imageUrl });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error Occurred", error: error.message });
  }
};

//* GET product list:  /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error fetching products", error: error.message });
  }
};

//* GET single product:  /api/product/:id
export const productById = async (req, res) => {
  try {
    const {productId }= req.body
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error fetching product", error: error.message });
  }
};

//* Change product inStock:  /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { productId, inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Stock status updated", data: product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error updating stock", error: error.message });
  }
};
