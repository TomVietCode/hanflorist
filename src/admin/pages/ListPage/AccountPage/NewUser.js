import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Notification, { showSuccess, showError } from "../../../components/Notification/index"; // Giả sử file Notification.js cùng thư mục
import { get, post } from "../../../../share/utils/http";

const UserAddPage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    roleId: "", // Để trống ban đầu, sẽ được cập nhật sau khi lấy roles
    status: "active",
  });
  const [roles, setRoles] = useState([]); // State để lưu danh sách roles từ backend
  const [notificationState, setNotificationState] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Xử lý đóng thông báo
  const handleCloseNotification = () => {
    setNotificationState({ ...notificationState, open: false });
  };

  // Lấy danh sách roles từ backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await get(token, "/admin/roles");
        const rolesData = result.data || [];
        setRoles(rolesData);

        // Nếu có roles, set roleId mặc định là role đầu tiên
        if (rolesData.length > 0) {
          setUser((prev) => ({ ...prev, roleId: rolesData[0]._id }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vai trò:", error);
        showError("Không thể lấy danh sách vai trò: " + error.message, setNotificationState);
      }
    };

    if (token) {
      fetchRoles();
    } else {
      showError("Bạn cần đăng nhập để thực hiện hành động này!", setNotificationState);
    }
  }, [token]);

  // Hàm kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      user.name.trim() !== "" &&
      user.email.trim() !== "" &&
      user.username.trim() !== "" &&
      user.password.trim() !== "" &&
      user.roleId !== "" &&
      user.status !== ""
    );
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!token) {
      showError("Bạn cần đăng nhập để thực hiện hành động này!", setNotificationState);
      return;
    }

    try {
      const result = await post(token, "/admin/users", {
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        roleId: user.roleId,
        status: user.status,
      });

      if (result.data) {
        showSuccess("Tạo tài khoản thành công!", setNotificationState);
        setUser({
          name: "",
          email: "",
          username: "",
          password: "",
          roleId: roles.length > 0 ? roles[0]._id : "", // Reset về role đầu tiên
          status: "active",
        });
        // Điều hướng về trang danh sách người dùng sau 2 giây
        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      showError(error.message || "Tạo mới tài khoản thất bại", setNotificationState);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
            Thêm mới tài khoản
          </Typography>
          <Grid container spacing={3}>
            {/* Họ tên */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Họ tên{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Họ tên"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{ style: { height: "2.5rem" } }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Email{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{ style: { height: "2.5rem" } }}
              />
            </Grid>

            {/* Tên tài khoản */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Tên tài khoản{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Tên tài khoản"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{ style: { height: "2.5rem" } }}
              />
            </Grid>

            {/* Mật khẩu */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Mật khẩu{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{ style: { height: "2.5rem" } }}
              />
            </Grid>

            {/* Phân quyền */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Phân quyền{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="roleId"
                  value={user.roleId}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    border: "none",
                    height: "2.5rem",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  disabled={roles.length === 0} // Vô hiệu hóa nếu không có roles
                >
                  {roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Trạng thái */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Trạng thái{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="status"
                  value={user.status}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    border: "none",
                    height: "2.5rem",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  className={
                    user.status === "active"
                      ? "active"
                      : user.status === "inactive"
                      ? "inactive"
                      : ""
                  }
                >
                  <MenuItem className="status-indicator-add active" value="active">
                    Hoạt động
                  </MenuItem>
                  <MenuItem className="status-indicator-add inactive" value="inactive">
                    Dừng hoạt động
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Nút Hủy và Thêm tài khoản */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                marginTop: "2rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/admin/users")}
                sx={{
                  width: "12rem",
                  fontSize: "1rem",
                  borderRadius: "20px",
                }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleSubmit}
                disabled={!isFormValid()} // Vô hiệu hóa nếu form không hợp lệ
                sx={{
                  width: "12rem",
                  fontSize: "1rem",
                  borderRadius: "20px",
                  "&:hover": { backgroundColor: "#1565c0" },
                  "&.Mui-disabled": {
                    backgroundColor: "#bdbdbd",
                    color: "#fff",
                  },
                }}
              >
                Thêm tài khoản
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Thông báo */}
      <Notification
        open={notificationState.open}
        severity={notificationState.severity}
        message={notificationState.message}
        onClose={handleCloseNotification}
      />
    </Container>
  );
};

export default UserAddPage;