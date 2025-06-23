import jwt from "jsonwebtoken";

const generateToken = async (userId) => {

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d", // you can change to '1h', '30m', etc.
    });
};

export default generateToken