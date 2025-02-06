import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/AdminLayout.js";
import Login from "./login";
import DashboardPage from "./pages/ListPage/DashboardPage/DashboardPage.js";
import ProductListPage from "./pages/ListPage/ProductListPage/ProductListPage.js";
import AddProductPage from "./pages/ListPage/ModulesPage/NewProductPage"; // Thêm import
import CategoryPage from "./pages/ListPage/CategoryPage/CategoryPage.js";
import NewCategoryPage from "./pages/ListPage/ModulesPage/NewCategoryPage/index.js"
import RoleManagementPage from "./pages/ListPage/RoleManagementPage/RoleManagementPage.js";
import AddNewRole from "./pages/ListPage/ModulesPage/NewRole/index.js"
import PermissionPage from "./pages/ListPage/PermissionPage/PermissionPage.js";
import AccountPage from "./pages/ListPage/AccountPage/AccountPage.js";
import SettingsPage from "./pages/ListPage/SettingsPage/SettingsPage.js";
import ProductDetail from "./pages/ListPage/ModulesPage/ProductDetail/index.js"
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
            path: "products/add-products", // Route cho Add Product Page
            element: <AddProductPage />,
          },
          {
            path: "products/view-products/:id", // Route cho Add Product Page
            element: <ProductDetail />,
          },
          {
            path: "categories",
            element: <CategoryPage />,
          },
          {
            path: "categories/add-categories",
            element: <NewCategoryPage />,
          },
          {
            path: "roles",
            element: <RoleManagementPage />,
          },
          {
            path: "roles/new",
            element: <AddNewRole />,
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
            path: "",
            element: <Navigate to="/admin/dashboard" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
];

export default routes;
