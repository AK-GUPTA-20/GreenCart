import express from "express";
import authUser from "../middleware/authUser.js";
import { updateCart, getCart } from "../controllers/cartController.js";

const cartRouter = express.Router(); 

cartRouter.use(express.json());

//* Update cart route
cartRouter.post("/update", authUser, updateCart);

//* Get cart route (for refreshing)
cartRouter.get("/get", authUser, getCart);

export default cartRouter;