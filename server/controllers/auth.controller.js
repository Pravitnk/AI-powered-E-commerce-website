import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { generateToken, generateTokenForAdmin } from "../config/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // 2. Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // 4. Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include an uppercase letter, a number, and a symbol.",
      });
    }

    // 5. Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // 7. Generate token
    const token = await generateToken(user._id);

    // 8. Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 9. Respond res.status(201).json({
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error occured while signing up the user ${error}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // 2. Check if user already exists
    // 3. Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // 3. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // 4. Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // 5. Generate JWT
    const token = await generateToken(user._id);

    // 6. Set JWT as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Respond with user info
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: `Login failed: ${error.message}`,
    });
  }
};

export const logut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Logout failed: ${error.message}`,
    });
  }
};

// let clientId =
//   "557095022981-2m5ip8102847b92di7du09iimiv3m7ti.apps.googleusercontent.com";

// export const googleLogin = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     // 1. Validate required fields
//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing name or email.",
//       });
//     }

//     // 2. Validate email format
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format.",
//       });
//     }

//     // 3. Check if user exists
//     let user = await User.findOne({ email });

//     // 4. If not, register them
//     if (!user) {
//       user = await User.create({ name, email });
//     }

//     // 5. Generate token
//     const token = generateToken(user._id);

//     // 6. Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     // 7. Respond
//     return res.status(200).json({
//       success: true,
//       message: "Logged in successfully.",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: `Google login failed: ${error.message}`,
//     });
//   }
// };

export const googleLogin = async (req, res) => {
  try {
    const { firebaseId, name, email, picture } = req.body;

    // 1. Basic validation
    if (!name || !email || !firebaseId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    // 2. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // First-time Google login → create user
      user = await User.create({ name, email, firebaseId, picture });
    } else {
      // Existing user → update firebaseId if not already set
      if (!user.firebaseId) {
        user.firebaseId = firebaseId;
      }
      // Do not override phoneNumber or picture unless missing
      if (!user.picture && picture) {
        user.picture = picture;
      }
      await user.save();
    }

    // 3. Generate token
    const token = generateToken(user._id);

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5. Response
    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: `Google login failed: ${error.message}`,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ✅ 2. Check against environment credentials
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // ✅ 3. Generate JWT token
    const token = await generateTokenForAdmin(email);

    // ✅ 4. Set cookie securely
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ 5. Respond
    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: `Login failed: ${error.message}`,
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};
