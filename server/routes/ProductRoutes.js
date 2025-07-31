import express from "express";
import {addProduct,productList,productById,changeStock,} from "../controllers/productController.js";
import {upload} from '../configs/multer.js';
import authSeller from '../middleware/authSeller.js';


const productRouter = express.Router();

//* Add new product - POST /api/product/add
productRouter.post("/add", upload.array("images"),authSeller ,addProduct);

//* Get all products - GET /api/product/list
productRouter.get("/list", productList);

//* Get single product by ID - GET /api/product/id
productRouter.get("/id", productById);

//* Change stock status - PATCH /api/product/stock
productRouter.post("/stock",authSeller,changeStock);

export default productRouter;
