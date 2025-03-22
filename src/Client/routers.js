import { Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import CategoriesPages from "./pages/CategoriesPages";

const routes = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/user",
    element: <LoginPage />,
  },
  {
    path: "/products/:category",
    element: <CategoriesPages />,
  },
  {
    path: "",
    element: <Navigate to="/" replace />,
  },
];

export default routes;