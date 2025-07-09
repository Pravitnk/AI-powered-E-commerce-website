import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  addToCart,
  getCartItems,
  updateCartItemQty,
} from "../controllers/cart.controller.js";

const cartRoute = express.Router();

cartRoute.post("/add", isAuth, addToCart);
cartRoute.get("/item", isAuth, getCartItems);
cartRoute.put("/update/:id", isAuth, updateCartItemQty);

export default cartRoute;
