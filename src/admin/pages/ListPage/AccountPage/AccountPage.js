import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import {
  Grid,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Notification, {
  showSuccess,
  showError,
  showConfirmDialog,
} from "../../../components/Notification";
import "./style.css";
import { get, patch, del } from "../../../../share/utils/http";

// Định nghĩa các cột
const columns = (
  navigate,
  toggleStatus,
  handleDelete,
  setConfirmDialog,
  handleCloseConfirmDialog,
  handleView,
  handleEdit
) => [
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
          {params.row.name}
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
            style={{
              width: "2.5rem",
              color: "#17a2b8",
              border: "solid 1px #17a2b8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleView(params.row);
            }}
          >
            <VisibilityIcon className="icon" />
          </span>
          <span
            className="box_icon bi2"
            style={{
              width: "2.5rem",
              color: "#ffc107",
              border: "solid 1px #ffc107",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <EditIcon className="icon" />
          </span>
          <Tooltip title="Xóa cứng">
            <span
              className="box_icon bi3"
              style={{
                width: "2.5rem",
                color: "#dc3545",
                border: "solid 1px #dc3545",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({
                  open: true,
                  title: "Xác nhận xóa vĩnh viễn người dùng",
                  onConfirm: () => {
                    handleDelete(params.row.realId, true);
                    handleCloseConfirmDialog();
                  },
                  onCancel: handleCloseConfirmDialog,
                });
              }}
            >
              <DeleteIcon className="icon" />
            </span>
          </Tooltip>
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
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(params.row.realId, params.value);
          }}
        >
          {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
      );
    },
  },
];

export default function UserListPage() {
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng gốc
  const [filteredUsers, setFilteredUsers] = useState([]); // State để lưu danh sách người dùng đã lọc
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const [loading, setLoading] = useState(false); // State để xử lý trạng thái loading
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0); // Tổng số người dùng để xử lý phân trang
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
  const [userType, setUserType] = useState("admin"); // State để lưu loại tài khoản (admin hoặc client)
  const [viewDialogOpen, setViewDialogOpen] = useState(false); // State cho popup xem thông tin
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State cho popup chỉnh sửa
  const [selectedUser, setSelectedUser] = useState(null); // State để lưu thông tin người dùng được chọn
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    roleId: "",
  }); // State để lưu thông tin chỉnh sửa
  const [roles, setRoles] = useState([]); // State để lưu danh sách vai trò
  const [rolesLoading, setRolesLoading] = useState(false); // State để xử lý trạng thái loading của roles

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

  // Xử lý chuyển đổi loại tài khoản
  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      setPaginationModel({ ...paginationModel, page: 0 });
      setSearchTerm("");
    }
  };

  // Hàm gọi API để lấy danh sách vai trò
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const result = await get(token, "/admin/roles");
      const rolesData = result.data || [];
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
      showError(
        "Có lỗi xảy ra khi lấy danh sách vai trò!",
        setNotificationState
      );
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  // Hàm gọi API để lấy danh sách người dùng
  const fetchUsers = async (page, pageSize, type) => {
    setLoading(true);
    try {
      const url = `/admin/users?role=${type}&page=${page + 1}&limit=${pageSize}`;

      const responseData = await get(token, url);
      const data = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];
      const total = responseData.total || data.length;

      const mappedUsers = data.map((user, index) => {
        const userRole = roles.find((role) => role._id === user.roleId);
        return {
          id: index + 1,
          realId: user._id || user.id,
          avatar: user.avatar || "https://via.placeholder.com/40",
          name: user.name || "",
          role: userRole ? userRole.title : (type === "admin" ? "Quản trị viên" : "Khách hàng"),
          email: user.email || "",
          status: user.status || "active",
          roleId: user.roleId || "",
        };
      });

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching users:", error);
      showError(
        "Có lỗi xảy ra khi lấy danh sách người dùng!",
        setNotificationState
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API để xóa người dùng
  const handleDelete = async (userId, isHard) => {
    try {
      await del(token, `/admin/users/${userId}`);

      showSuccess(
        isHard
          ? "Xóa vĩnh viễn người dùng thành công!"
          : "Xóa mềm người dùng thành công!",
        setNotificationState
      );
      fetchUsers(paginationModel.page, paginationModel.pageSize, userType);
    } catch (error) {
      console.error("Error deleting user:", error);
      showError(
        isHard
          ? "Có lỗi xảy ra khi xóa vĩnh viễn người dùng!"
          : "Có lỗi xảy ra khi xóa mềm người dùng!",
        setNotificationState
      );
    }
  };

  // Hàm chuyển đổi trạng thái người dùng
  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      setUsers((prev) =>
        prev.map((user) =>
          user.realId === userId ? { ...user, status: newStatus } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.realId === userId ? { ...user, status: newStatus } : user
        )
      );

      await patch(token, `/admin/users/${userId}`, { status: newStatus });

      showSuccess("Cập nhật trạng thái thành công!", setNotificationState);
      fetchUsers(paginationModel.page, paginationModel.pageSize, userType);
    } catch (error) {
      console.error("Error toggling status:", error);
      setUsers((prev) =>
        prev.map((user) =>
          user.realId === userId ? { ...user, status: currentStatus } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.realId === userId ? { ...user, status: currentStatus } : user
        )
      );
      showError(
        "Có lỗi xảy ra khi cập nhật trạng thái!",
        setNotificationState
      );
    }
  };

  // Hàm xử lý xem thông tin người dùng
  const handleView = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  // Hàm xử lý chỉnh sửa thông tin người dùng
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      roleId: user.roleId || "",
    });
    setEditDialogOpen(true);
  };

  // Hàm xử lý cập nhật thông tin người dùng
  const confirmEdit = async () => {
    if (!editUser.name.trim() || !editUser.email.trim() || !editUser.roleId) {
      showError(
        "Vui lòng điền đầy đủ thông tin!",
        setNotificationState
      );
      return;
    }

    try {
      const response = await patch(token, `/admin/users/${selectedUser.realId}`, {
        name: editUser.name,
        email: editUser.email,
        roleId: editUser.roleId,
      });

      showSuccess(
        "Cập nhật thông tin người dùng thành công!",
        setNotificationState
      );
      fetchUsers(paginationModel.page, paginationModel.pageSize, userType);
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditUser({ name: "", email: "", roleId: "" });
    } catch (error) {
      console.error("Error updating user:", error);
      showError(
        "Có lỗi xảy ra khi cập nhật thông tin người dùng!",
        setNotificationState
      );
    }
  };

  // Xử lý tìm kiếm realtime
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  // Gọi API khi component mount hoặc khi paginationModel hoặc userType thay đổi
  useEffect(() => {
    if (token) {
      fetchRoles(); // Lấy danh sách vai trò trước
    } else {
      console.error("No token found, please log in.");
      showError(
        "Bạn cần đăng nhập để truy cập danh sách người dùng!",
        setNotificationState
      );
    }
  }, [token]);

  // Gọi fetchUsers sau khi roles đã được tải
  useEffect(() => {
    if (token && !rolesLoading) {
      fetchUsers(paginationModel.page, paginationModel.pageSize, userType);
    }
  }, [paginationModel, userType, rolesLoading, token]);

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
      <Box
        sx={{
          flexGrow: 1,
          padding: 1,
          paddingLeft: 2,
          boxSizing: "border-box",
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/users/new-users")}
              sx={{
                height: "2.6rem",
                px: 2,
                fontSize: "18px",
                backgroundColor: "#1976d2",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
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
          </Grid>
          <Grid item>
            <TextField
              placeholder="Tìm kiếm theo tên"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                marginLeft: 5,
                width: "300px",
                "& .MuiInputBase-root": {
                  height: "2.6rem",
                  borderRadius: "8px",
                },
                "& .MuiInputLabel-root": {
                  top: "-5px",
                },
              }}
            />
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              sx={{
                marginLeft: 5,
                height: "2.6rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                "& .MuiToggleButton-root": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  border: "none",
                  padding: "0 20px",
                  color: "#666",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      boxShadow: "inset 0 3px 8px rgba(0, 0, 0, 0.3)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                  },
                },
              }}
            >
              <ToggleButton value="admin">Admin</ToggleButton>
              <ToggleButton value="client">Client</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>
      <DataGrid
        rowHeight={90}
        rows={filteredUsers}
        columns={columns(
          navigate,
          toggleStatus,
          handleDelete,
          setConfirmDialog,
          handleCloseConfirmDialog,
          handleView,
          handleEdit
        )}
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

      {/* Popup xem thông tin người dùng */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", bgcolor: "#1976d2", color: "white", py: 2 }}>
          Thông tin người dùng
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Card sx={{ m: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              {selectedUser && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Avatar
                      src={selectedUser.avatar}
                      alt="Avatar"
                      sx={{
                        width: 120,
                        height: 120,
                        border: "3px solid #1976d2",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      <strong>Họ tên:</strong> {selectedUser.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      <strong>Email:</strong> {selectedUser.email}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      <strong>Phân quyền:</strong> {selectedUser.role}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        className={`status-indicator ${
                          selectedUser.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {selectedUser.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setViewDialogOpen(false)}
            variant="outlined"
            color="secondary"
            sx={{
              width: "12rem",
              fontSize: "1rem",
              borderRadius: "20px",
              "&:hover": { borderColor: "#d32f2f", color: "#d32f2f" },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup chỉnh sửa thông tin người dùng */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", bgcolor: "#1976d2", color: "white", py: 2 }}>
          Chỉnh sửa thông tin người dùng
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Card sx={{ m: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <DialogContentText sx={{ textAlign: "center", mb: 3, color: "#666" }}>
                Vui lòng nhập thông tin mới cho người dùng{" "}
                <strong>{selectedUser?.name}</strong>.
              </DialogContentText>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Họ tên{" "}
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <TextField
                    autoFocus
                    fullWidth
                    name="name"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    placeholder="Họ tên"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                          transition: "border-color 0.3s ease",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                    InputProps={{ style: { height: "2.5rem" } }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    placeholder="Email"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                          transition: "border-color 0.3s ease",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                    InputProps={{ style: { height: "2.5rem" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Phân quyền{" "}
                    <Typography component="span" color="error">
                      *
                    </Typography>
                  </Typography>
                  <FormControl fullWidth>
                    {rolesLoading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <Select
                        value={editUser.roleId}
                        onChange={(e) =>
                          setEditUser({ ...editUser, roleId: e.target.value })
                        }
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                          border: "none",
                          height: "2.5rem",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        }}
                        disabled={roles.length === 0}
                      >
                        {Array.isArray(roles) && roles.length > 0 ? (
                          roles.map((role) => (
                            <MenuItem key={role._id} value={role._id}>
                              {role.title}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Không có vai trò nào</MenuItem>
                        )}
                      </Select>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            color="secondary"
            sx={{
              width: "12rem",
              fontSize: "1rem",
              borderRadius: "20px",
              "&:hover": { borderColor: "#d32f2f", color: "#d32f2f" },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            color="primary"
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
            disabled={
              !editUser.name.trim() ||
              !editUser.email.trim() ||
              !editUser.roleId ||
              rolesLoading
            }
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hộp thoại xác nhận */}
      {confirmDialog.open &&
        showConfirmDialog(
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Paper>
  );
}