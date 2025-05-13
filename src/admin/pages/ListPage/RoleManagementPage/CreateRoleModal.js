import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Notification, { showSuccess, showError } from "../../../components/Notification/index";
import { post, patch } from "../../../../share/utils/http";

const CreateRoleModal = ({
  open,
  onClose,
  selectedRole,
  setSelectedRole,
  newRole,
  setNewRole,
  setRoles,
  roles,
  token,
}) => {
  const [permissions, setPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [notificationState, setNotificationState] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Xử lý đóng thông báo
  const handleCloseNotification = () => {
    setNotificationState({ ...notificationState, open: false });
  };

  // Xử lý tạo/chỉnh sửa nhóm quyền
  const handleSaveRole = async () => {
    try {
      const roleData = {
        title: newRole.title,
        description: newRole.description,
        permissions: newRole.permissions || [],
      };
      
      let result;
      if (selectedRole) {
        // Cập nhật nhóm quyền
        result = await patch(token, `/admin/roles/${selectedRole._id}`, roleData);
      } else {
        // Tạo nhóm quyền mới
        result = await post(token, "/admin/roles", roleData);
      }

      if (selectedRole) {
        // Cập nhật nhóm quyền trong danh sách
        setRoles(
          roles.map((role) =>
            role._id === selectedRole._id
              ? { ...role, title: newRole.title, description: newRole.description, permissions: newRole.permissions }
              : role
          )
        );
        showSuccess("Cập nhật nhóm quyền thành công!", setNotificationState);
      } else {
        // Thêm nhóm quyền mới
        const newRoleData = { _id: result.data, ...newRole, status: "active" };
        setRoles([...roles, newRoleData]);
        showSuccess("Tạo nhóm quyền thành công!", setNotificationState);
      }
      onClose();
      setNewRole({ title: "", description: "", permissions: [] });
      setSelectedRole(null);
    } catch (error) {
      console.error("Lỗi khi lưu nhóm quyền:", error);
      showError("Lỗi khi lưu nhóm quyền: " + error.message, setNotificationState);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRole ? "Chỉnh sửa nhóm quyền" : "Tạo nhóm quyền mới"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên nhóm quyền"
            value={newRole.title}
            onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Mô tả"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            sx={{ mb: 2 }}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Notification
        open={notificationState.open}
        severity={notificationState.severity}
        message={notificationState.message}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc trên bên phải
      />
    </>
  );
};

export default CreateRoleModal;