import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Product from "./pages/Product";
import List from "./pages/List";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchAdmin } from "./redux/reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  const { admin, isFetchingAdmin } = useSelector((state) => state.auth);

  // if (!isFetchingAdmin) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  useEffect(() => {
    dispatch(fetchAdmin());
  }, []);
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Router>
        <Toaster position="buttom-right" reverseOrder={false} />

        <Header />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/product" element={<Product />} />
            <Route path="/lists" element={<List />} />
            {/* Add more protected routes here if needed */}
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
