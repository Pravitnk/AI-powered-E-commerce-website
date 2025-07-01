import express from "express";
import { getUserDetail, updateUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

const userRoute = express.Router();

userRoute.get("/details", isAuth, getUserDetail);
userRoute.put("/update", isAuth, updateUser);

export default userRoute;
