import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // adjust path as needed
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import cartRoute from "./routes/cart.routes.js";

dotenv.config();
connectDB(); // 🔗 Connect to MongoDB

const app = express();
// middleware, routes etc...
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.get("/", (req, res) => {
  res.send("jelp");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
