import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filePath) {
      throw new Error("File path is missing");
    }

    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // Clean up local file

    return uploadResult.secure_url;
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up even on error
    }

    console.error("Cloudinary Upload Error:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;
