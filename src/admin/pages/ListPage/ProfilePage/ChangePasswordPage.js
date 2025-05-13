// pages/ListPage/ChangePasswordPage/index.js
import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { post } from "../../../../share/utils/http";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = await post(token, "/admin/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (data.status !== "error") {
        setSuccess("Đổi mật khẩu thành công!");
      } else {
        setError(data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra, vui lòng thử lại sau.");
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Đổi mật khẩu
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "400px" }}>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" variant="body2">
            {success}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          Đổi mật khẩu
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;