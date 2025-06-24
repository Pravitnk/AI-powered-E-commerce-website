import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // adjust path as needed
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";

dotenv.config();
connectDB(); // 🔗 Connect to MongoDB

const app = express();
// middleware, routes etc...
app.use(express.json()); // for parsing application/json
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("jelp");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
