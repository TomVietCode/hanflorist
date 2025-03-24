import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const UserAddPage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "", // Thêm trường username
    password: "", // Thêm trường password
    roleId: "admin", // Giá trị mặc định là admin
    status: "active",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Hàm kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      user.name.trim() !== "" && // Họ tên không rỗng
      user.email.trim() !== "" && // Email không rỗng
      user.username.trim() !== "" && // Tên tài khoản không rỗng
      user.password.trim() !== "" && // Mật khẩu không rỗng
      user.roleId !== "" && // Phân quyền không rỗng
      user.status !== "" // Trạng thái không rỗng
    );
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!token) {
      setError("Bạn cần đăng nhập để thực hiện hành động này!");
      return;
    }

    const baseUrl = "http://localhost:3001";
    const path = "/admin/users";

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          username: user.username, // Thêm username vào body
          password: user.password, // Thêm password vào body
          roleId: user.roleId, // Giá trị sẽ là "admin" hoặc "client"
          status: user.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        setError(null);
        setUser({
          name: "",
          email: "",
          username: "", // Reset username
          password: "", // Reset password
          roleId: "admin",
          status: "active",
        });
        // Điều hướng về trang danh sách người dùng
        navigate("/admin/users");
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      setError(error.message || "Tạo mới tài khoản thất bại");
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
                >
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="client">Người dùng</MenuItem>
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
                    backgroundColor: "#bdbdbd", // Màu khi bị vô hiệu hóa
                    color: "#fff",
                  },
                }}
              >
                Thêm tài khoản
              </Button>
            </Grid>

            {/* Thông báo lỗi */}
            {error && (
              <Grid item xs={12}>
                <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserAddPage;