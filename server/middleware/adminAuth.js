import jwt from "jsonwebtoken";

const isAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Token is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Validate that token belongs to admin
    if (decoded.id !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not authorized as admin.",
      });
    }
    req.adminEmail = decoded.id; // Set admin email from environment variable
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default isAdminAuth;
