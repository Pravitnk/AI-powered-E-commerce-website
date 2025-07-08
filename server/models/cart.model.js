// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product", // matches your Product model name
    required: true,
  },
  qty: {
    type: Number,
    default: 1,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // adjust based on your actual User model name
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("cart", cartSchema);
