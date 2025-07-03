import express from "express";
import {
  getAdmin,
  getUserDetail,
  updateUser,
} from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import isAdminAuth from "../middleware/adminAuth.js";

const userRoute = express.Router();

userRoute.get("/details", isAuth, getUserDetail);
userRoute.patch("/update", isAuth, updateUser);

//admin
userRoute.get("/me", isAdminAuth, getAdmin);

export default userRoute;
