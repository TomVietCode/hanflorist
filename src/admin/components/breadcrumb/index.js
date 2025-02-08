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
  "add-products": "Thêm sản phẩm", 
  "view-products": "Sản phẩm",
  "edit-products": "Sửa sản phẩm",
  "add-categories": "Thêm danh mục",
  "new-categories": "Thêm quyền",
  "new-roles" : "Thêm quyền",
  "edit-role" : "sửa quyền"
};


function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Loại bỏ phần cuối cùng nếu đó là ID
  const filteredPathnames = pathnames.filter((path, index) => {
    // Loại bỏ phần cuối nếu là ID (dự đoán ID là chuỗi ký tự dài)
    if (index === pathnames.length - 1 && /^[a-f0-9]{24}$/i.test(path)) {
      return false; // Không hiển thị ID
    }
    return true; // Hiển thị các phần còn lại
  });

  return (
    <Box display="flex" alignItems="center" marginBottom="8px" marginTop="0">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          display: "flex",
          alignItems: "center",
          "& .MuiBreadcrumbs-separator": { mx: 1 },
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Home Icon */}
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            color: "#3f51b5",
            textDecoration: "none",
            fontSize: "18px",
            transition: "color 0.3s ease",
          }}
          to="/admin/dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        </Link>

        {/* Hiển thị breadcrumb */}
        {filteredPathnames.map((path, index) => {
          const isLast = index === filteredPathnames.length - 1;
          const pathTo = `/${filteredPathnames.slice(0, index + 1).join("/")}`;
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
                color: "#212121",
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
                color: "#616161",
                fontSize: "16px",
                textTransform: "capitalize",
                transition: "color 0.3s ease",
                fontWeight: 500,
              }}
              onMouseOver={(e) => (e.target.style.color = "#3f51b5")}
              onMouseOut={(e) => (e.target.style.color = "#616161")}
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
