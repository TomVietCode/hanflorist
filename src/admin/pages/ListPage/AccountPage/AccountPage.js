import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { Grid, Button, Box, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";

// Định nghĩa các cột
const columns = (navigate, toggleStatus) => [
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
      <Avatar src={params.value} alt="Avatar" sx={{ width: 60, height: 60 }} />
    ),
  },
  {
    field: "fullName",
    headerName: "Họ tên",
    flex: 2,
    headerAlign: "center",
    headerClassName: "header-style",
    renderCell: (params) => (
      <div
        className="hover-cell"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          padding: "0 10px",
          overflow: "hidden",
          fontSize: "17px",
        }}
      >
        <span
          className="hover-title"
          style={{
            transition: "transform 0.3s ease-in-out",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            cursor: "pointer",
          }}
        >
          {params.row.fullName}
        </span>
        <span
          className="hover-content"
          style={{
            position: "absolute",
            left: "10px",
            bottom: "-10px",
            display: "flex",
            gap: "5px",
            opacity: 0,
            transition:
              "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
            padding: 5,
          }}
        >
          <span
            className="box_icon bi1"
            style={{ width: "2.5rem", color: "#17a2b8", border: "solid 1px #17a2b8" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/users/view/${params.row.id}`);
            }}
          >
            <VisibilityIcon className="icon" />
          </span>
          <span
            className="box_icon bi2"
            style={{ width: "2.5rem", color: "#ffc107", border: "solid 1px #ffc107" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/users/edit/${params.row.id}`);
            }}
          >
            <EditIcon className="icon" />
          </span>
          <span
            className="box_icon bi3"
            style={{ width: "2.5rem", color: "#dc3545", border: "solid 1px #dc3545" }}
            onClick={(e) => {
              e.stopPropagation();
              // handleDelete(params.row.id);
            }}
          >
            <DeleteIcon className="icon" />
          </span>
        </span>
      </div>
    ),
    cellClassName: "hover-cell",
  },
  {
    field: "role",
    headerName: "Phân quyền",
    align: "center",
    flex: 2,
    headerAlign: "center",
    headerClassName: "header-style",
  },
  {
    field: "email",
    headerName: "Email",
    align: "center",
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
    cellClassName: "status-cell",
    renderCell: (params) => {
      const isActive = params.value === "active";
      return (
        <span
          className={`status-indicator ${isActive ? "active" : "inactive"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(params.row.id, params.value);
          }}
        >
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      );
    },
  },
];

export default function UserListPage() {
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
  const [loading, setLoading] = useState(false); // State để xử lý trạng thái loading
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10, // Mặc định limit là 10
    page: 0, // Page bắt đầu từ 0 trong DataGrid, nhưng API bắt đầu từ 1
  });
  const [totalRows, setTotalRows] = useState(0); // Tổng số người dùng để xử lý phân trang
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  }); // State để hiển thị thông báo

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Hook để điều hướng
  const navigate = useNavigate();

  // Hàm gọi API để lấy danh sách người dùng
  const fetchUsers = async (page, pageSize, role = "admin") => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:3001/admin/users");
      url.searchParams.append("role", role);
      url.searchParams.append("page", page + 1);
      url.searchParams.append("limit", pageSize);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const data = Array.isArray(responseData) ? responseData : responseData.data || [];
      const total = responseData.total || data.length;

      setUsers(
        data.map((user, index) => ({
          id: user.id || index + 1,
          avatar: user.avatar || "https://via.placeholder.com/40",
          fullName: user.fullName || "",
          role: user.role || "Quản trị viên",
          email: user.email || "",
          status: user.status || "active",
        }))
      );
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi lấy danh sách người dùng!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API để xóa người dùng
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNotification({
        open: true,
        message: "Xóa người dùng thành công!",
        severity: "success",
      });
      fetchUsers(paginationModel.page, paginationModel.pageSize); // Làm mới danh sách
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi xóa người dùng!",
        severity: "error",
      });
    }
  };

  // Hàm chuyển đổi trạng thái người dùng
  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      // Cập nhật giao diện trước để cải thiện trải nghiệm người dùng
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      // Gửi yêu cầu PATCH để cập nhật trạng thái
      const response = await fetch(`http://localhost:3001/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNotification({
        open: true,
        message: "Cập nhật trạng thái thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      // Nếu có lỗi, hoàn nguyên trạng thái
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: currentStatus } : user
        )
      );
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật trạng thái!",
        severity: "error",
      });
    }
  };

  // Gọi API khi component mount hoặc khi paginationModel thay đổi
  useEffect(() => {
    if (token) {
      fetchUsers(paginationModel.page, paginationModel.pageSize);
    } else {
      console.error("No token found, please log in.");
      setNotification({
        open: true,
        message: "Bạn cần đăng nhập để truy cập danh sách người dùng!",
        severity: "error",
      });
    }
  }, [paginationModel, token]);

  // Xử lý đóng thông báo
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

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
      <Box sx={{ flexGrow: 1, padding: 1, paddingLeft: 2, boxSizing: "border-box" }}>
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/users/new-users")} // Điều hướng đến trang thêm mới
              style={{
                padding: "8px 15px",
                display: "flex",
                height: "80%",
                marginLeft: 1,
                marginTop: "8px",
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
        rows={users}
        columns={columns(navigate, toggleStatus)}
        pagination
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        loading={loading}
        onPaginationModelChange={(newModel) => {
          setPaginationModel(newModel);
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
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

      {/* Snackbar để hiển thị thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}