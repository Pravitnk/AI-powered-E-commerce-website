import express from "express";
import {
  adminLogin,
  googleLogin,
  login,
  logoutAdmin,
  logut,
  register,
} from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/googlelogin", googleLogin);
authRoute.get("/logout", logut);

//admin login route
authRoute.post("/admin-login", adminLogin);
authRoute.post("/admin-logout", logoutAdmin);

export default authRoute;
