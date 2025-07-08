import express from "express";
import isAuth from "../middleware/isAuth.js";
import { addToCart } from "../controllers/cart.controller.js";

const cartRoute = express.Router();

cartRoute.post("/add", isAuth, addToCart);

export default cartRoute;
