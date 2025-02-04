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
  categories: "Danh mục sản phẩm",
  roles: "Nhóm quyền",
  permissions: "Phân quyền",
  products: "Danh sách sản phẩm",
  accounts: "Tài khoản",
  add: "Thêm sản phẩm",
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
          fontFamily: "'Roboto', sans-serif", // Chọn font đẹp và rõ ràng
          
        }}
      >
        {/* Home Icon */}
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            color: "#3f51b5", // Màu sắc cho Home
            textDecoration: "none",
            fontSize: "18px", // Tăng cỡ chữ cho biểu tượng Home
            transition: "color 0.3s ease", // Hiệu ứng khi hover
            
          }}
          to="/admin/dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        </Link>

        {/* Hiển thị breadcrumb */}
        {pathnames.map((path, index) => {
          const isLast = index === pathnames.length - 1;
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const breadcrumbText =
            breadcrumbNameMap[path] || path.replace(/-/g, " ");

          return isLast ? (
            <Typography
              key={path}
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{
                textTransform: "capitalize",
                fontSmooth: "always",
                WebkitFontSmoothing: "antialiased",
                color: "#212121", // Đảm bảo chữ cuối cùng dễ đọc
                
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
                color: "#616161", // Màu chữ cho các liên kết
                fontSize: "16px",
                textTransform: "capitalize",
                transition: "color 0.3s ease", // Hiệu ứng khi hover
                fontWeight: 500,
                
              }}
              onMouseOver={(e) => (e.target.style.color = "#3f51b5")} // Hover color
              onMouseOut={(e) => (e.target.style.color = "#616161")} // Color default khi không hover
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
