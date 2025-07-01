import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage });

// app.post("/api/upload", upload.single("image"), (req, res) => {
//   res.json({ url: req.file.path }); // file.path is the Cloudinary URL
// });
