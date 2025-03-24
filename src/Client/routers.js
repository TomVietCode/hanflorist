import { Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import CategoriesPages from "./pages/CategoriesPages";
import Layout from "./components/Layout"; // Import Layout

const routes = [
  {
    path: "/",
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ), 
  },
  {
    path: "/user",
    element: <LoginPage />, 
  },
  {
    path: "/products/:category",
    element: (
      <Layout>
        <CategoriesPages />
      </Layout>
    )
  },
  {
    path: "",
    element: <Navigate to="/" replace />,
  },
];

export default routes;