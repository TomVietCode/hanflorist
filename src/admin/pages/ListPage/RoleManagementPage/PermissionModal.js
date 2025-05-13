import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TextField,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, Undo, Save } from "@mui/icons-material";
import Notification, { showSuccess, showError } from '../../../components/Notification/index'; // Giả sử file thông báo nằm ở cùng thư mục
import { get, patch } from "../../../../share/utils/http";

// Danh sách các module và hành động cho phân quyền
const modules = [
  { name: "category", label: "Danh mục sản phẩm" },
  { name: "product", label: "Sản phẩm" },
  { name: "role", label: "Nhóm quyền" },
  { name: "user", label: "Tài khoản" },
  { name: "settings", label: "Cài đặt chung" },
];

const actionKeys = { "Xem": "view", "Thêm": "add", "Sửa": "edit", "Xóa": "delete" };
const actionKeysReverse = { "read": "view", "create": "add", "update": "edit", "delete": "delete", "permissions": "edit" };

const PermissionModal = ({
  openPermissionModal,
  setOpenPermissionModal,
  openUserPermissionModal,
  setOpenUserPermissionModal,
  selectedRole,
  setSelectedRole,
  setRoles,
  token,
}) => {
  const [permissions, setPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [rolePermissions, setRolePermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const [backupUserPermissions, setBackupUserPermissions] = useState({});
  const [userName, setUserName] = useState("Người dùng mặc định");
  const [roleTitle, setRoleTitle] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [notificationState, setNotificationState] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Xử lý đóng thông báo
  const handleCloseNotification = () => {
    setNotificationState({ ...notificationState, open: false });
  };

  // Lấy danh sách quyền
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const result = await get(token, "/admin/roles");
        const perms = result.data.permissions || [];

        const grouped = perms.reduce((acc, perm) => {
          const module = perm.module || "Khác";
          if (!acc[module]) acc[module] = [];
          acc[module].push(perm);
          return acc;
        }, {});
        setGroupedPermissions(grouped);
        setPermissions(perms);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quyền:", error);
        showError("Lỗi khi lấy danh sách quyền: " + error.message, setNotificationState);
      }
    };

    if (token) fetchPermissions();
  }, [token]);

  // Khởi tạo phân quyền nhóm
  useEffect(() => {
    if (openPermissionModal && selectedRole) {
      const initialPermissions = selectedRole.permissions || [];
      setRolePermissions(initialPermissions);
      setRoleTitle(selectedRole.title || "");
      setRoleDescription(selectedRole.description || "");
    }
  }, [openPermissionModal, selectedRole]);

  // Khởi tạo phân quyền người dùng
  useEffect(() => {
    if (openUserPermissionModal && selectedRole) {
      const initialPermissions = Object.fromEntries(
        modules.map((module) => [
          module.name,
          module.name === "settings"
            ? { view: false, edit: false }
            : { view: false, add: false, edit: false, delete: false },
        ])
      );

      const rolePerms = selectedRole.permissions || [];
      rolePerms.forEach((perm) => {
        const [module, action] = perm.split("_");
        if (module && action && initialPermissions[module]) {
          const actionKey = actionKeysReverse[action] || action;
          if (actionKey in initialPermissions[module]) {
            initialPermissions[module][actionKey] = true;
          }
        }
      });

      setUserPermissions(initialPermissions);
      setBackupUserPermissions(initialPermissions);
      setUserName("Người dùng mặc định");
    }
  }, [openUserPermissionModal, selectedRole]);

  // Xử lý thay đổi quyền nhóm
  const handlePermissionChange = (permissionId) => {
    const permission = permissions.find((perm) => perm._id === permissionId);
    const permissionName = permission ? `${permission.module}_${permission.action}` : null;

    if (!permissionName) return;

    if (rolePermissions.includes(permissionName)) {
      setRolePermissions(rolePermissions.filter((name) => name !== permissionName));
    } else {
      setRolePermissions([...rolePermissions, permissionName]);
    }
  };

  // Chọn tất cả quyền trong một module
  const handleSelectAllModule = (modulePermissions, checked) => {
    const permissionNames = modulePermissions.map((perm) => `${perm.module}_${perm.action}`);
    if (checked) {
      setRolePermissions([...new Set([...rolePermissions, ...permissionNames])]);
    } else {
      setRolePermissions(rolePermissions.filter((name) => !permissionNames.includes(name)));
    }
  };

  // Lưu quyền nhóm
  const handleSavePermissions = async () => {
    try {
      const updatedRoleData = {
        id: selectedRole._id,
        permissions: rolePermissions,
        title: roleTitle,
        description: roleDescription,
      };

      const result = await patch(token, "/admin/roles/permissions/", updatedRoleData);
      
      if (result.data !== true) {
        throw new Error("Cập nhật vai trò không thành công");
      }

      // Cập nhật state cha ngay lập tức
      setRoles((prev) =>
        prev.map((role) =>
          role._id === selectedRole._id
            ? { ...role, title: roleTitle, description: roleDescription, permissions: rolePermissions }
            : role
        )
      );

      // Cập nhật selectedRole để giữ giao diện nhất quán
      setSelectedRole({
        ...selectedRole,
        title: roleTitle,
        description: roleDescription,
        permissions: rolePermissions,
      });

      showSuccess("Cập nhật vai trò thành công!", setNotificationState);
      setOpenPermissionModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
      showError("Lỗi khi cập nhật vai trò: " + error.message, setNotificationState);
    }
  };

  // Xử lý thay đổi quyền người dùng
  const handleUserPermissionChange = (module, action) => {
    const actionKey = actionKeys[action];
    const newValue = !userPermissions?.[module]?.[actionKey];
    const updatedPermissions = { ...userPermissions };

    if (!updatedPermissions[module]) updatedPermissions[module] = {};
    updatedPermissions[module][actionKey] = newValue;

    if (newValue && (actionKey === "delete" || actionKey === "edit")) {
      updatedPermissions[module].view = true;
    } else if (!newValue && actionKey === "view") {
      updatedPermissions[module] = { view: false, add: false, edit: false, delete: false };
    }

    setUserPermissions(updatedPermissions);
  };

  // Chọn tất cả quyền người dùng
  const handleSelectAllUserPermissions = () => {
    const allChecked = modules.every((module) =>
      (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).every(
        (action) => userPermissions?.[module.name]?.[actionKeys[action]]
      )
    );

    const updatedPermissions = Object.fromEntries(
      modules.map((module) => [
        module.name,
        Object.fromEntries(
          (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).map((action) => [
            actionKeys[action],
            !allChecked,
          ])
        ),
      ])
    );

    setUserPermissions(updatedPermissions);
  };

  // Hoàn tác thay đổi quyền người dùng
  const handleUndoUserPermissionChanges = () => {
    setUserPermissions(backupUserPermissions);
    showSuccess("Đã hoàn tác các thay đổi phân quyền người dùng!", setNotificationState);
  };

  // Lưu phân quyền người dùng
  const handleSaveUserPermissions = async () => {
    try {
      const permissionsArray = [];
      Object.entries(userPermissions).forEach(([module, actions]) => {
        Object.entries(actions).forEach(([action, enabled]) => {
          if (enabled) {
            const permissionKey = action === "view" ? "read" : action;
            permissionsArray.push(`${module}_${permissionKey}`);
          }
        });
      });

      await patch(token, "/admin/roles/permissions", [{ id: selectedRole._id, permissions: permissionsArray }]);

      // Cập nhật state cha ngay lập tức
      setRoles((prev) =>
        prev.map((role) =>
          role._id === selectedRole._id ? { ...role, permissions: permissionsArray } : role
        )
      );

      // Cập nhật selectedRole để giữ giao diện nhất quán
      setSelectedRole({
        ...selectedRole,
        permissions: permissionsArray,
      });

      setBackupUserPermissions(userPermissions);
      showSuccess("Phân quyền người dùng thành công!", setNotificationState);
      setOpenUserPermissionModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu phân quyền:", error);
      showError("Lỗi khi phân quyền người dùng: " + error.message, setNotificationState);
    }
  };

  return (
    <>
      {/* Modal phân quyền nhóm */}
      <Dialog open={openPermissionModal} onClose={() => setOpenPermissionModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Phân quyền cho nhóm: {selectedRole?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Tên vai trò"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mô tả"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </Box>

          {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
            <Box key={module} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="h6">{module}</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => handleSelectAllModule(modulePermissions, e.target.checked)}
                      checked={modulePermissions.every((perm) =>
                        rolePermissions.includes(`${perm.module}_${perm.action}`)
                      )}
                    />
                  }
                  label="Chọn tất cả"
                  sx={{ ml: 2 }}
                />
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Quyền</TableCell>
                      <TableCell align="center">Gán quyền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modulePermissions.map((permission) => (
                      <TableRow key={permission._id}>
                        <TableCell>{permission.title}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={rolePermissions.includes(`${permission.module}_${permission.action}`)}
                            onChange={() => handlePermissionChange(permission._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermissionModal(false)}>Hủy</Button>
          <Button onClick={handleSavePermissions} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal phân quyền người dùng */}
      <Dialog open={openUserPermissionModal} onClose={() => setOpenUserPermissionModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Phân quyền cho người dùng: {userName}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tính năng</TableCell>
                  <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                    Quyền
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Chọn tất cả</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chọn tất cả">
                      <Checkbox
                        checked={modules.every((module) =>
                          (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).every(
                            (action) => userPermissions?.[module.name]?.[actionKeys[action]]
                          )
                        )}
                        onChange={handleSelectAllUserPermissions}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module) => (
                  <React.Fragment key={module.name}>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }} colSpan={2}>
                        {module.label}
                      </TableCell>
                    </TableRow>
                    {(module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).map((action) => (
                      <TableRow key={action} hover>
                        <TableCell sx={{ fontWeight: "bold" }}>{action}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={userPermissions?.[module.name]?.[actionKeys[action]] || false}
                            onChange={() => handleUserPermissionChange(module.name, action)}
                            color="primary"
                            icon={<CheckBoxOutlineBlank />}
                            checkedIcon={<CheckBox />}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleUndoUserPermissionChanges} startIcon={<Undo />}>
            Hoàn tác
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveUserPermissions} startIcon={<Save />}>
            Lưu
          </Button>
          <Button onClick={() => setOpenUserPermissionModal(false)}>Hủy</Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Notification
        open={notificationState.open}
        severity={notificationState.severity}
        message={notificationState.message}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default PermissionModal;