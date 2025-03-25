// privateRouter.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "./components/loading/loding.js";
import { getLocalStorage } from "../share/hepler/localStorage.js";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const isLogin = getLocalStorage("token")
  if (loading) {
    return <Loading/>;
  }

  if (!isLogin) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;