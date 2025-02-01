import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { Grid, Button, Box } from "@mui/material"; // Import Grid, Button, và Box
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon
import "./style.css"; // Import file CSS

// Dữ liệu mẫu
const sampleData = [
  {
    id: 1,
    avatar: "https://via.placeholder.com/40",
    fullName: "Nguyễn Mạnh Cường",
    role: "Quản trị viên",
    email: "mcuong04.work@gmail.com",
    status: "active", // "active" hoặc "inactive"
  },
  {
    id: 2,
    avatar: "https://via.placeholder.com/40",
    fullName: "Nguyễn Văn A",
    role: "Quản lý sản phẩm",
    email: "nguyenvana@gmail.com",
    status: "active",
  },
  {
    id: 3,
    avatar: "https://via.placeholder.com/40",
    fullName: "Nguyễn Văn B",
    role: "Quản lý danh mục",
    email: "nguyenvanb@gmail.com",
    status: "inactive",
  },
  {
    id: 4,
    avatar: "https://via.placeholder.com/40",
    fullName: "",
    role: "Quản trị viên",
    email: "",
    status: "active",
  },
];

// Định nghĩa các cột
const columns = [
  {
    field: "id",
    headerName: "STT",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-style",
  },
  {
    field: "avatar",
    headerName: "Avatar",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-style",
    renderCell: (params) => (
      <Avatar src={params.value} alt="Avatar" sx={{ width: 80, height: 80 }} />
    ),
  },
  {
    field: "fullName",
    headerName: "Họ tên",
    flex: 2,
    headerAlign: "center",
    headerClassName: "header-style",
  },
  {
    field: "role",
    headerName: "Phân quyền",
    flex: 2,
    headerAlign: "center",
    headerClassName: "header-style",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
    headerAlign: "center",
    headerClassName: "header-style",
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-style",
    cellClassName: "status-cell", // Thêm class tùy chỉnh cho cột Trạng thái
    renderCell: (params) => {
      const isActive = params.value === "active";
      return (
        <span
          className={`status-indicator ${isActive ? "active" : "inactive"}`}
        >
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      );
    },
  },
];

export default function UserListPage() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <Paper
      className="UserListPage"
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexGrow: 1, padding: 1,paddingLeft: 2, boxSizing: "border-box" }}>
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => alert("Thêm mới")}
              style={{
                padding: "8px 15px",
                display: "flex",
                height: "80%",
                marginLeft: 1,
                border: "solid 1px #ccc",
                minWidth: "auto",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              Thêm mới
            </Button>
          </Grid>
        </Grid>
      </Box>
      <DataGrid
        rowHeight={90}
        rows={sampleData}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        onPageChange={(newPage) => {
          console.log(newPage);
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center", // Căn giữa theo chiều dọc
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
          userSelect: "none",
        }}
      />
    </Paper>
  );
}