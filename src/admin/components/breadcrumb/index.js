import React from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box } from "@mui/material";

// Định nghĩa ánh xạ giữa đường dẫn và tiêu đề hiển thị
const breadcrumbNameMap = {
  dashboard: "Tổng quan",
  settings: "Cài đặt",
  categories: "Danh mục",
  roles: "Nhóm quyền",
  permissions: "Phân quyền",
  products: "Sản phẩm",
  accounts: "Tài khoản",
  "user-management": "Quản lý người dùng",
  "order-details": "Chi tiết đơn hàng",
};

function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box display="flex" alignItems="center" marginBottom="8px" marginTop="0">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          display: "flex",
          alignItems: "center",
          "& .MuiBreadcrumbs-separator": { mx: 1 },
        }}
      >
        {/* Home Icon */}
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
          to="/admin/dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        </Link>

        {/* Hiển thị breadcrumb */}
        {pathnames.map((path, index) => {
          const isLast = index === pathnames.length - 1;
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const breadcrumbText = breadcrumbNameMap[path] || path.replace(/-/g, " ");

          return isLast ? (
            <Typography
              key={path}
              variant="h5"
              fontWeight="bold"
              color="black"
              sx={{
                textTransform: "capitalize",
                fontSmooth: "always",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {breadcrumbText}
            </Typography>
          ) : (
            <Link
              key={path}
              to={pathTo}
              style={{
                textDecoration: "none",
                color: "gray",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {breadcrumbText}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

export default DynamicBreadcrumbs;
