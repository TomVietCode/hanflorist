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
import PermissionPage from "./pages/ListPage/OderPage/Oder.js";
import InforOder from "./pages/ListPage/OderPage/inforOder.js"; // Đổi tên import thành InforOder
import AccountPage from "./pages/ListPage/AccountPage/AccountPage.js";
import NewUser from "./pages/ListPage/AccountPage/NewUser.js";
import SettingsPage from "./pages/ListPage/SettingsPage/SettingsPage.js";
import ProductDetail from "./pages/ListPage/ModulesPage/ProductDetail/index.js";
import EditProduct from "./pages/ListPage/ModulesPage/EditProduct/index.js";
import DeletePage from "./pages/ListPage/ModulesPage/deletePage/index.js";
import NotFound from "./pages/ListPage/ModulesPage/404NotFound/index.js";
import PrivateRoute from "./privateRouter.js";

// Thêm các trang mới cho profile và change-password
import ProfilePage from "./pages/ListPage/ProfilePage/ProfilePage.js";
import ChangePasswordPage from "./pages/ListPage/ProfilePage/ChangePasswordPage.js";

const routes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "products",
            element: <ProductListPage />,
          },
          {
            path: "products/delete",
            element: <DeletePage />,
          },
          {
            path: "products/add-products",
            element: <AddProductPage />,
          },
          {
            path: "products/view-products/:id",
            element: <ProductDetail />,
          },
          {
            path: "products/edit-products/:id",
            element: <EditProduct />,
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
            path: "roles/new-role",
            element: <AddNewRole />,
          },
          {
            path: "roles/edit-role",
            element: <AddNewRole />,
          },
          {
            path: "orders", // Sửa "oders" thành "orders"
            element: <PermissionPage />,
          },
          {
            path: "orders/view-order/:orderId", // Cập nhật route để khớp với OrderManagement
            element: <InforOder />, // Sử dụng InforOder
          },
          {
            path: "users",
            element: <AccountPage />,
          },
          {
            path: "users/new-users",
            element: <NewUser />,
          },
          {
            path: "users/view-users",
            element: <NewUser />,
          },
          {
            path: "users/edit-users",
            element: <NewUser />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "change-password",
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