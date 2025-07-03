import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";

//create/add product (POST)
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = await uploadOnCloudinary(req.files.image1[0].path);
    const image2 = await uploadOnCloudinary(req.files.image2[0].path);
    const image3 = await uploadOnCloudinary(req.files.image3[0].path);
    const image4 = await uploadOnCloudinary(req.files.image4[0].path);

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    return res.status(201).json({
      success: false,
      message: `Error while adding product is ${error}`,
    });
  }
};

//get product (GET)
export const getProduct = async (req, res) => {
  try {
  } catch (error) {}
};

//update product (PATCH)
export const updateProduct = async (req, res) => {
  try {
  } catch (error) {}
};

//delete product (DELETE)
export const deleteProduct = async (req, res) => {
  try {
  } catch (error) {}
};
