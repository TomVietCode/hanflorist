// privateRouter.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "./components/loading/loding.js";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading/>;
  }

  if (!user) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;