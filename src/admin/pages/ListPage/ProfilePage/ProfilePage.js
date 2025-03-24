// pages/ListPage/ProfilePage/index.js
import React from "react";
import { useAuth } from "../../../AuthContext";
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import { format } from "date-fns"; // Để định dạng ngày tháng

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin tài khoản
        </Typography>
        <Typography variant="body1">Không có thông tin tài khoản.</Typography>
      </Box>
    );
  }

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Thông tin tài khoản
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={user.name}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Tên người dùng:</strong> {user.username}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Vai trò:</strong>{" "}
              <Chip
                label={user.role}
                color={user.role === "admin" ? "primary" : "default"}
                size="small"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Trạng thái:</strong>{" "}
              <Chip
                label={user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                color={user.status === "active" ? "success" : "error"}
                size="small"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Ngày tạo:</strong> {formatDate(user.createdAt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Ngày cập nhật:</strong> {formatDate(user.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;