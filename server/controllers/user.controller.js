import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary ENV:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
});

export const getUserDetail = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to fetch user: ${error.message}`,
    });
  }
};

// PATCH /api/user/update
// export const updateUser = async (req, res) => {
//   try {
//     const { userId } = req; // from middleware / token
//     const { phoneNumber, picture } = req.body;

//     const updated = await User.findByIdAndUpdate(
//       userId,
//       { phoneNumber, picture },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Profile updated",
//       user: updated,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { name, phoneNumber, image } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let pictureUrl;
    console.log("Received image:", image?.slice(0, 50));

    console.log("Received base64 image length:", image?.length);
    if (image) {
      try {
        const uploaded = await cloudinary.uploader.upload(image, {
          folder: "user_profiles",
          resource_type: "image",
        });
        pictureUrl = uploaded.secure_url;
      } catch (uploadErr) {
        console.error("error is ", uploadErr);

        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(pictureUrl && { picture: pictureUrl }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
