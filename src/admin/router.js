import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/AdminLayout.js";
import Login from "./login";
import DashboardPage from "./pages/ListPage/DashboardPage/DashboardPage.js";
import ProductListPage from "./pages/ListPage/ProductListPage/ProductListPage.js";
import AddProductPage from "./pages/ListPage/ModulesPage/NewProductPage";
import CategoryPage from "./pages/ListPage/CategoryPage/CategoryPage.js";
import NewCategoryPage from "./pages/ListPage/ModulesPage/NewCategoryPage/index.js";
import RoleManagementPage from "./pages/ListPage/RoleManagementPage/RoleManagementPage.js";
import AddNewRole from "./pages/ListPage/ModulesPage/NewRole/index.js";
import PermissionPage from "./pages/ListPage/PermissionPage/PermissionPage.js";
import AccountPage from "./pages/ListPage/AccountPage/AccountPage.js";
import SettingsPage from "./pages/ListPage/SettingsPage/SettingsPage.js";
import ProductDetail from "./pages/ListPage/ModulesPage/ProductDetail/index.js";
import EditProduct from "./pages/ListPage/ModulesPage/EditProduct/index.js";
import DeletePage from "./pages/ListPage/ModulesPage/deletePage/index.js";
import NotFound from "./pages/ListPage/ModulesPage/404NotFound/index.js";
import PrivateRoute from "./privateRouter.js";

const routes = [
  {
    path: "/admin",
    element: <Navigate to="/admin/auth/login" replace />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin", // Route cha cho các trang admin
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard", // /admin/dashboard
            element: <DashboardPage />,
          },
          {
            path: "products", // /admin/products
            element: <ProductListPage />,
          },
          {
            path: "products/delete", // /admin/products/delete
            element: <DeletePage />,
          },
          {
            path: "products/add-products", // /admin/products/add-products
            element: <AddProductPage />,
          },
          {
            path: "products/view-products/:id", // /admin/products/view-products/:id
            element: <ProductDetail />,
          },
          {
            path: "products/edit-products/:id", // /admin/products/edit-products/:id
            element: <EditProduct />,
          },
          {
            path: "categories", // /admin/categories
            element: <CategoryPage />,
          },
          {
            path: "categories/add-categories", // /admin/categories/add-categories
            element: <NewCategoryPage />,
          },
          {
            path: "roles", // /admin/roles
            element: <RoleManagementPage />,
          },
          {
            path: "roles/new-role", // /admin/roles/new-role
            element: <AddNewRole />,
          },
          {
            path: "roles/edit-role", // /admin/roles/edit-role
            element: <AddNewRole />,
          },
          {
            path: "permissions", // /admin/permissions
            element: <PermissionPage />,
          },
          {
            path: "accounts", // /admin/accounts
            element: <AccountPage />,
          },
          {
            path: "settings", // /admin/settings
            element: <SettingsPage />,
          },
          // Xóa path: "" để tránh chuyển hướng tự động khi vào /admin
        ],
      },
    ],
  },
  {
    path: "/admin/auth/login",
    element: <Login />, // Trang login riêng biệt
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;