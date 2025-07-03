import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const generateTokenForAdmin = async (email) => {
  return jwt.sign({ id: email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
