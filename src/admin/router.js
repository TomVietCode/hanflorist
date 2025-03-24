// router.js
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
import NewUser from "./pages/ListPage/AccountPage/NewUser.js";
import SettingsPage from "./pages/ListPage/SettingsPage/SettingsPage.js";
import ProductDetail from "./pages/ListPage/ModulesPage/ProductDetail/index.js";
import EditProduct from "./pages/ListPage/ModulesPage/EditProduct/index.js";
import DeletePage from "./pages/ListPage/ModulesPage/deletePage/index.js";
import NotFound from "./pages/ListPage/ModulesPage/404NotFound/index.js";
import PrivateRoute from "./privateRouter.js";

// Thêm các trang mới cho profile và change-password
import ProfilePage from "./pages/ListPage/ProfilePage/ProfilePage.js"; // Trang thông tin tài khoản
import ChangePasswordPage from "./pages/ListPage/ProfilePage/ChangePasswordPage.js"; // Trang đổi mật khẩu

const routes = [
  {
    element: <PrivateRoute />,
    children: [ 
      {
        path: "/admin", // Route cha cho các trang admin
        element: <DashboardLayout />,
        children: [
          {
            path: "", // /admin
            element: <Navigate to="/admin/dashboard" replace />, // Chuyển hướng mặc định về dashboard
          },
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
            path: "users", // /admin/users
            element: <AccountPage />,
          },
          {
            path: "users/new-users", // /admin/users/new-users
            element: <NewUser />,
          },
          {
            path: "users/view-users", // /admin/users/view-users
            element: <NewUser />,
          },
          {
            path: "users/edit-users", // /admin/users/edit-users
            element: <NewUser />,
          },
          {
            path: "settings", // /admin/settings
            element: <SettingsPage />,
          },
          {
            path: "profile", // /admin/profile
            element: <ProfilePage />,
          },
          {
            path: "change-password", // /admin/change-password
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/auth/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;