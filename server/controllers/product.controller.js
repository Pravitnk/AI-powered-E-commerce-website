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

    // 1. Validate fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !sizes ||
      !req.files?.image1 ||
      !req.files?.image2 ||
      !req.files?.image3 ||
      !req.files?.image4
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields and 4 images must be provided",
      });
    }
    // 2. Upload images
    // const imageUploads = await Promise.all([
    //   uploadOnCloudinary(req.files.image1[0].path),
    //   uploadOnCloudinary(req.files.image2[0].path),
    //   uploadOnCloudinary(req.files.image3[0].path),
    //   uploadOnCloudinary(req.files.image4[0].path),
    // ]);

    const imagePaths = ["image1", "image2", "image3", "image4"].map((key) => {
      if (!req.files[key] || !req.files[key][0]?.path) {
        throw new Error(`Missing image file: ${key}`);
      }
      return req.files[key][0].path;
    });

    const imageUploads = await Promise.all(
      imagePaths.map((filePath) => uploadOnCloudinary(filePath))
    );

    if (imageUploads.some((url) => !url)) {
      return res.status(500).json({
        success: false,
        message: "One or more image uploads failed",
      });
    }
    // 3. Create product object
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true",
      date: Date.now(),
      image1: imageUploads[0],
      image2: imageUploads[1],
      image3: imageUploads[2],
      image4: imageUploads[3],
    };

    // 4. Save to DB
    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error while adding product:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error while adding product: ${error.message}`,
    });
  }
};
//get product (GET)
export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

//update product (PATCH)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedFields = { ...req.body };

    // Parse sizes and price
    if (updatedFields.sizes) {
      updatedFields.sizes = JSON.parse(updatedFields.sizes);
    }
    if (updatedFields.price) {
      updatedFields.price = Number(updatedFields.price);
    }

    const imageFields = ["image1", "image2", "image3", "image4"];

    // ✅ Fetch existing product only once
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // ✅ Process image uploads
    for (let field of imageFields) {
      if (req.files?.[field]?.[0]) {
        const uploaded = await uploadOnCloudinary(req.files[field][0].path);
        updatedFields[field] = uploaded;
      } else if (!updatedFields[field]) {
        // Only retain if not already updated
        updatedFields[field] = existingProduct[field];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

//delete product (DELETE)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
