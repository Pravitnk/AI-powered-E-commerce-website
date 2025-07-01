import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import EditProfile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { getUser } from "./redux/reducers/userSlice";

const App = () => {
  const theme = useSelector((state) => state.theme.mode); // 'light' or 'dark'
  const { user } = useSelector((state) => state.user); // 'light' or 'dark'
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try {
      await dispatch(getUser());
    } catch (error) {
      console.log("error while fetching user..", error);
    }
  };
  console.log(user);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Router>
        <Toaster position="buttom-right" reverseOrder={false} />

        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<EditProfile />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
