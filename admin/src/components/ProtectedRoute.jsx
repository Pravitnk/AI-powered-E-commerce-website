import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { admin, isFetchingAdmin } = useSelector((state) => state.auth);

  if (isFetchingAdmin) {
    return null; // or show a spinner/loading component
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
