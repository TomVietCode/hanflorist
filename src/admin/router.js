import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/AdminLayout.js";
import Login from "./login";
import DashboardPage from "./pages/ListPage/DashboardPage/DashboardPage.js";
import ProductListPage from "./pages/ListPage/ProductListPage/ProductListPage.js";
import CategoryPage from "./pages/ListPage/CategoryPage/CategoryPage.js";
import RoleManagementPage from "./pages/ListPage/RoleManagementPage/RoleManagementPage.js";
import PermissionPage from "./pages/ListPage/PermissionPage/PermissionPage.js";
import AccountPage from "./pages/ListPage/AccountPage/AccountPage.js";
import SettingsPage from "./pages/ListPage/SettingsPage/SettingsPage.js";
import PrivateRoute from "./privateRouter.js";


const routes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "products",
            element: <ProductListPage />,
          },
          {
            path: "categories",
            element: <CategoryPage />,
          },
          {
            path: "roles",
            element: <RoleManagementPage />,
          },
          {
            path: "permissions",
            element: <PermissionPage />,
          },
          {
            path: "accounts",
            element: <AccountPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "", // Default khi truy cập "/admin"
            element: <Navigate to="/admin/dashboard" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/login", // Đường dẫn login
    element: <Login />,
  },
  {
    path: "/", // Redirect "/" tới "/admin/login"
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "*", // Route không tồn tại
    element: <div>404 - Page Not Found</div>,
  },
];

export default routes;
