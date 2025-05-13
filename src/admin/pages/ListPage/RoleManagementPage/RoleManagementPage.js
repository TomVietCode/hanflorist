import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useNavigate } from "react-router-dom";
import CreateRoleModal from "./CreateRoleModal";
import PermissionModal from "./PermissionModal";
import Notification, { showSuccess, showError, showConfirmDialog } from "../../../components/Notification/index";
import "./style.css";
import { get, del, patch } from "../../../../share/utils/http";

// Skeleton cho loading
const SkeletonRow = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f9f9f9",
    }}
  >
    <div style={{ flex: "0.5", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          height: "2rem",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "2.5" }}>
      <div
        style={{
          width: "100%",
          height: "2rem",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "3" }}>
      <div
        style={{
          width: "80%",
          height: "2rem",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.7", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "50%",
          height: "2rem",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.5", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "60%",
          height: "2rem",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
  </div>
);

const RoleManagementPage = () => {
  const [roles, setRoles] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [openUserPermissionModal, setOpenUserPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    title: "",
    description: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [notificationState, setNotificationState] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Xử lý đóng thông báo
  const handleCloseNotification = () => {
    setNotificationState({ ...notificationState, open: false });
  };

  // Xử lý đóng hộp thoại xác nhận
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Lấy danh sách nhóm quyền
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const result = await get(token, "/admin/roles");
      setRoles(result.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm quyền:", error);
      showError("Lỗi khi lấy danh sách nhóm quyền: " + error.message, setNotificationState);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [token]);

  // Xử lý xóa nhóm quyền
  const handleDeleteRole = async (roleId) => {
    try {
      const result = await del(token, `/admin/roles/${roleId}`);
      setRoles(roles.filter((role) => role._id !== roleId));
      showSuccess("Xóa nhóm quyền thành công!", setNotificationState);
    } catch (error) {
      console.error("Lỗi khi xóa nhóm quyền:", error);
      showError("Lỗi khi xóa nhóm quyền: " + error.message, setNotificationState);
    }
  };

  // Xử lý chuyển trạng thái nhóm quyền
  const handleToggleStatus = async (roleId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      // Cập nhật giao diện trước để cải thiện trải nghiệm người dùng
      setRoles((prev) =>
        prev.map((role) =>
          role._id === roleId ? { ...role, status: newStatus } : role
        )
      );

      // Gửi yêu cầu PATCH để cập nhật trạng thái
      const roleToUpdate = roles.find((role) => role._id === roleId);
      await patch(token, `/admin/roles/${roleId}`, {
        title: roleToUpdate.title,
        description: roleToUpdate.description,
        permissions: roleToUpdate.permissions,
        status: newStatus,
      });

      showSuccess("Cập nhật trạng thái thành công!", setNotificationState);
    } catch (error) {
      // Nếu có lỗi, hoàn nguyên trạng thái
      setRoles((prev) =>
        prev.map((role) =>
          role._id === roleId ? { ...role, status: currentStatus } : role
        )
      );
      console.error("Lỗi khi cập nhật trạng thái:", error);
      showError("Lỗi khi cập nhật trạng thái: " + error.message, setNotificationState);
    }
  };

  // Cột của DataGrid
  const columns = [
    {
      field: "stt",
      headerName: "STT",
      flex: 0.5,
      align: "center",
      renderCell: (params) => {
        const index = roles.indexOf(params.row);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    {
      field: "name",
      headerName: "Tên nhóm quyền",
      flex: 2.5,
      renderCell: (params) => (
        <div className="hover-cell">
          <span className="hover-title">{params.row.title}</span>
          <span className="hover-content">
            <span
              className="box_icon bi2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole(params.row);
                setNewRole({
                  title: params.row.title,
                  description: params.row.description,
                  permissions: params.row.permissions || [],
                });
                setOpenCreateModal(true);
              }}
            >
              <BorderColorIcon className="icon" />
            </span>
            <span
              className="box_icon bi3"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({
                  open: true,
                  title: "Xác nhận xóa nhóm quyền",
                  onConfirm: () => {
                    handleDeleteRole(params.row._id);
                    handleCloseConfirmDialog();
                  },
                  onCancel: handleCloseConfirmDialog,
                });
              }}
            >
              <DeleteIcon className="icon" />
            </span>
          </span>
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 3,
      renderCell: (params) => params.value || "Không có mô tả",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.value === "active";
        return (
          <span
            className={`status-indicator ${isActive ? "active" : "inactive"}`}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDialog({
                open: true,
                title: `Xác nhận chuyển trạng thái thành "${isActive ? "Dừng hoạt động" : "Đang hoạt động"}"`,
                onConfirm: () => {
                  handleToggleStatus(params.row._id, params.value);
                  handleCloseConfirmDialog();
                },
                onCancel: handleCloseConfirmDialog,
              });
            }}
          >
            {isActive ? "Đang hoạt động" : "Dừng hoạt động"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Phân quyền",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Tooltip title="Phân quyền nhóm">
            <IconButton
              onClick={() => {
                setSelectedRole(params.row);
                setOpenUserPermissionModal(true);
              }}
            >
              <GroupAddOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateModal(true)}
        sx={{
          height: "2.5rem",
          px: 2,
          fontSize: "16px",
          backgroundColor: "#1976d2",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
          marginBottom: "1rem",
          "&:hover": {
            backgroundColor: "#1565c0",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
            transform: "translateY(-2px)",
            transition: "all 0.3s ease",
          },
          "&:active": {
            backgroundColor: "#0d47a1",
            transform: "translateY(1px)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          },
          transition: "all 0.3s ease",
        }}
      >
        Thêm mới
      </Button>

      {/* DataGrid hiển thị danh sách nhóm quyền */}
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={roles}
          columns={columns}
          rowHeight={85}
          pageSize={paginationModel.pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row._id}
          disableSelectionOnClick
          loading={loading}
          slots={{
            loadingOverlay: () => (
              <div>
                {[...Array(5)].map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </div>
            ),
          }}
          sx={{
            "& .center-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            userSelect: "none",
          }}
        />
      </Box>

      {/* Modal tạo/chỉnh sửa nhóm quyền */}
      <CreateRoleModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        newRole={newRole}
        setNewRole={setNewRole}
        setRoles={setRoles}
        roles={roles}
        token={token}
      />

      {/* Modal phân quyền */}
      <PermissionModal
        openPermissionModal={openPermissionModal}
        setOpenPermissionModal={setOpenPermissionModal}
        openUserPermissionModal={openUserPermissionModal}
        setOpenUserPermissionModal={setOpenUserPermissionModal}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        setRoles={setRoles}
        token={token}
      />

      {/* Hộp thoại xác nhận */}
      {confirmDialog.open && showConfirmDialog(
        confirmDialog.title,
        confirmDialog.onConfirm,
        confirmDialog.onCancel
      )}

      {/* Thông báo */}
      <Notification
        open={notificationState.open}
        severity={notificationState.severity}
        message={notificationState.message}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc trên bên phải
      />
    </Container>
  );
};

export default RoleManagementPage;