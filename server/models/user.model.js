import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseId: {
      type: String,
      unique: true,
      sparse: true, // Optional if not all users are from Firebase
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Only required for email/password users
    },
    picture: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
