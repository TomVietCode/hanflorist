import React from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng không reload trang
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AllInboxIcon from '@mui/icons-material/AllInbox';
// Các component giao diện cho từng trang
import DashboardPage from "../../pages/ListPage/DashboardPage/DashboardPage";
import ProductListPage from "../../pages/ListPage/ProductListPage/ProductListPage";
import CategoryPage from "../../pages/ListPage/CategoryPage/CategoryPage";
import RoleManagementPage from "../../pages/ListPage/RoleManagementPage/RoleManagementPage";
import PermissionPage from "../../pages/ListPage/OderPage/Oder.js";
import AccountPage from "../../pages/ListPage/AccountPage/AccountPage";
import SettingsPage from "../../pages/ListPage/SettingsPage/SettingsPage";
import AddProductPage from "../../pages/ListPage/ModulesPage/NewProductPage"


export const NAVIGATION = [
  {
    segment: "admin/dashboard",
    title: "Tổng quan",
    icon: <DashboardIcon />,
    path: "/admin/dashboard",
    component: DashboardPage,
    link: <Link to="/admin/dashboard">Tổng quan</Link>, // Sử dụng Link thay vì a
  },
  {
    segment: "admin/products",  
    title: "Danh sách sản phẩm",
    icon: <AllInboxIcon />,
    path: "/admin/products",
    component: ProductListPage,
    link: <Link to="/admin/products">Danh sách sản phẩm</Link>, // Sử dụng Link thay vì a
  },
  {
    segment: "admin/categories",
    title: "Danh mục sản phẩm",
    icon: <FormatListBulletedOutlinedIcon />,
    path: "/admin/categories", 
    component: CategoryPage,
    link: <Link to="/admin/categories">Danh mục sản phẩm</Link>, // Sử dụng Link thay vì a
  },
  {
    segment: "admin/roles",
    title: "Nhóm quyền",
    icon: <Groups2OutlinedIcon />,
    path: "/admin/roles", 
    component: RoleManagementPage,
    link: <Link to="/admin/roles">Nhóm quyền</Link>, // Sử dụng Link thay vì a
  },
  {
    segment: "admin/users",
    title: "Tài khoản",
    icon: <AccountCircleIcon />,
    path: "/admin/accounts", 
    component: AccountPage,
    link: <Link to="/admin/users">Tài khoản</Link>, // Sử dụng Link thay vì a
  },
  {
    segment: "admin/orders",
    title: "Đơn hàng",
    icon: <ShoppingCartIcon />,
    path: "/admin/orders", 
    component: PermissionPage,
    link: <Link to="/admin/orders">Phân quyền</Link>, // Sử dụng Link thay vì a
  },
  
  {
    segment: "admin/settings",
    title: "Cài đặt chung",
    icon: <SettingsOutlinedIcon />,
    path: "/admin/settings", 
    component: SettingsPage,
    link: <Link to="/admin/settings">Cài đặt chung</Link>, // Sử dụng Link thay vì a
  },
];
