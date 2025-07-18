import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    image4: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    bestSeller: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;
