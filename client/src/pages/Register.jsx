import React, { useState } from "react";
import logo from "@/assets/images.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/Firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/reducers/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ connect to backend here
    try {
      const result = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(result)) {
        toast.success("Logged in successfully");
        navigate("/login");
      } else {
        toast.error(result.payload || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const googleRegister = async (e) => {
    try {
      e.preventDefault();
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(
        "http://localhost:5000/api/auth/googlelogin",
        {
          name,
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(result?.data);
      navigate("/register");
    } catch (error) {
      console.error(`error while signing up with google, ${error}`);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        {/* Product Info */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-orange-400 to-orange-600 text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome to MyShop</h2>
          <p className="text-lg">
            Discover the latest AI-powered shopping experience. Sign up and be
            the first to try it out!
          </p>
          <img
            src="/illustration.svg" // add a relevant image in your public folder
            alt="AI Shopping"
            className="w-3/4 mt-6"
          />
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="relative">
              {showPassword ? (
                <FaEye
                  className="h-4 w-5 absolute right-[4%] top-[56%] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <FaEyeSlash
                  className="h-4 w-5 absolute right-[4%] top-[56%]  cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-500 text-white font-medium py-2 rounded-md transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Registering user..." : "Register"}
            </button>

            <div className="text-lg font-semibold text-center">OR</div>
            <div
              className="h-10 bg-gray-400 font-medium py-2 rounded-md hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
              onClick={googleRegister}
            >
              <img src={logo} alt="google" className="h-8 w-8 rounded-full" />
              <span>Register with Google</span>
            </div>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
