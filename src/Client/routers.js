import { Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import CategoriesPages from "./pages/CategoriesPages";
import Layout from "./components/Layout";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import LoginSuccess from "./pages/LoginPage/loginSuccess";
import OrderSuccess from "./pages/CheckoutPage/OrderSuccess";
import ProductDetailPage from './pages/ProductDetailPage/index';
import SearchResultPage from './pages/SearchResultPage/index';

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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login-success",
    element: <LoginSuccess />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout>
          <ProfilePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories/:category",
    element: (
      <Layout>
        <CategoriesPages />
      </Layout>
    ),
  },
  {
    path: "/product/:slug",
    element: (
      <Layout>
        <ProductDetailPage />
      </Layout>
    ),
  },
  {
    path: "/cart",
    element: (
      <Layout>
        <CartPage />
      </Layout>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Layout>
        <CheckoutPage />
      </Layout>
    ),
  },
  {
    path: "/order-success",
    element: (
      <Layout>
        <OrderSuccess />
      </Layout>
  ),
  },
  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <Layout>
          <ChangePasswordPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <Layout>
        <SearchResultPage />
      </Layout>
    ),
  },
  {
    path: "",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
