import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Tooltip,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, Undo, Save } from "@mui/icons-material";

const roles = ["Quản trị viên", "Quản lý sản phẩm", "Quản lý danh mục"];
const modules = [
  { name: "category", label: "Danh mục sản phẩm" },
  { name: "product", label: "Sản phẩm" },
  { name: "role", label: "Nhóm quyền" },
  { name: "account", label: "Tài khoản" },
  { name: "settings", label: "Cài đặt chung" },
];
const actions = ["view", "add", "edit", "delete"];

const initialPermissions = {
  admin: {
    category: { view: true, add: true, edit: true, delete: true },
    product: { view: true, add: true, edit: true, delete: true },
    role: { view: true, add: true, edit: true, delete: true },
    account: { view: true, add: true, edit: true, delete: true },
    settings: { view: true, edit: true },
  },
  productManager: {
    category: { view: true, add: true, edit: true, delete: true },
    product: { view: true, add: true, edit: true, delete: true },
    role: { view: false, add: false, edit: false, delete: false },
    account: { view: false, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
  categoryManager: {
    category: { view: true, add: true, edit: true, delete: true },
    product: { view: true, add: false, edit: false, delete: false },
    role: { view: false, add: false, edit: false, delete: false },
    account: { view: false, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
};

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [backupPermissions, setBackupPermissions] = useState(initialPermissions);

  // Xử lý thay đổi quyền
  const handlePermissionChange = (role, module, action) => {
    const newValue = !permissions[role][module][action];
    const updatedPermissions = { ...permissions };

    updatedPermissions[role][module][action] = newValue;

    if (newValue) {
      switch (action) {
        case "delete":
          updatedPermissions[role][module].view = true;
          updatedPermissions[role][module].edit = true;
          break;
        case "edit":
          updatedPermissions[role][module].view = true;
          break;
        case "assign":
          updatedPermissions[role][module].view = true;
          updatedPermissions[role][module].edit = true;
          break;
        default:
          break;
      }
    } else {
      switch (action) {
        case "view":
          updatedPermissions[role][module].edit = false;
          updatedPermissions[role][module].delete = false;
          updatedPermissions[role][module].assign = false;
          break;
        case "edit":
          updatedPermissions[role][module].delete = false;
          updatedPermissions[role][module].assign = false;
          break;
        default:
          break;
      }
    }

    setPermissions(updatedPermissions);
  };

  // Chọn tất cả quyền cho một vai trò
  const handleSelectAllForRole = (role) => {
    const allChecked = modules.every((module) =>
      actions.every((action) => permissions[role]?.[module.name]?.[action] !== undefined)
    );
    const updatedPermissions = { ...permissions };

    updatedPermissions[role] = modules.reduce((acc, module) => {
      acc[module.name] = actions.reduce((moduleAcc, action) => {
        moduleAcc[action] = !allChecked;
        return moduleAcc;
      }, {});
      return acc;
    }, {});

    setPermissions(updatedPermissions);
  };

  // Hoàn tác các thay đổi
  const handleUndoChanges = () => {
    setPermissions(backupPermissions);
  };

  // Lưu phân quyền
  const handleSave = () => {
    setBackupPermissions(permissions);
    console.log("Permissions saved:", permissions);
    alert("Phân quyền đã được lưu thành công!");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Module</TableCell>
              {roles.map((role) => (
                <TableCell key={role} align="center" sx={{ color: "white", fontWeight: "bold" }}>
                  <Typography variant="subtitle1">{role}</Typography>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>Chọn tất cả</TableCell>
              {roles.map((role) => (
                <TableCell key={role} align="center" sx={{ backgroundColor: "#f0f0f0" }}>
                  <Tooltip title="Chọn tất cả">
                    <Checkbox
                      checked={modules.every((module) =>
                        actions.every((action) => permissions[role]?.[module.name]?.[action] !== undefined)
                      )}
                      onChange={() => handleSelectAllForRole(role)}
                    />
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module) => (
              <React.Fragment key={module.name}>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell colSpan={roles.length + 1}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                      {module.label}
                    </Typography>
                  </TableCell>
                </TableRow>
                {(module.name === "settings" ? ["view", "edit"] : actions).map((action) => (
                  <TableRow key={action} hover sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                    <TableCell sx={{ fontWeight: "medium", color: "#555" }}>{action}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role} align="center">
                        <Checkbox
                          checked={permissions[role]?.[module.name]?.[action] || false}
                          onChange={() => handlePermissionChange(role, module.name, action)}
                          color="primary"
                          icon={<CheckBoxOutlineBlank />}
                          checkedIcon={<CheckBox />}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUndoChanges}
          startIcon={<Undo />}
          sx={{ fontWeight: "bold" }}
        >
          Hoàn tác
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{ fontWeight: "bold", boxShadow: 2 }}
        >
          Lưu phân quyền
        </Button>
      </Box>
    </Container>
  );
}
