import React from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box } from "@mui/material";

function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const lastName = pathnames[pathnames.length - 1] || "Dashboard"; // Mặc định nếu không có gì

  return (
    <Box display="flex" alignItems="center" marginBottom="20px">
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

        {/* Chỉ hiển thị tên cuối cùng với font lớn hơn */}
        <Typography
          variant="h5"
          fontWeight="bold"
          color="black"
          sx={{
            textTransform: "capitalize",
            fontSmooth: "always",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {lastName.replace(/-/g, " ")}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}

export default DynamicBreadcrumbs;
