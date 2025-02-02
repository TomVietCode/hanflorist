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
import "./style.css"

const roles = ["Quản trị viên", "Quản lý sản phẩm", "Quản lý danh mục"];
const roleKeys = { "Quản trị viên": "admin", "Quản lý sản phẩm": "productManager", "Quản lý danh mục": "categoryManager" };

const modules = [
  { name: "category", label: "Danh mục sản phẩm" },
  { name: "product", label: "Sản phẩm" },
  { name: "role", label: "Nhóm quyền" },
  { name: "account", label: "Tài khoản" },
  { name: "settings", label: "Cài đặt chung" },
];

const actionKeys = { "Xem": "view", "Thêm": "add", "Sửa": "edit", "Xóa": "delete" };

const initialPermissions = {
  admin: Object.fromEntries(
    modules.map((m) => [
      m.name,
      m.name === "settings"
        ? { view: true, edit: true }
        : { view: true, add: true, edit: true, delete: true }
    ])
  ),
  productManager: {
    category: { view: true, add: true, edit: true, delete: true },
    product: { view: true, add: true, edit: true, delete: true },
    role: {},
    account: {},
    settings: { view: true, edit: true },
  },
  categoryManager: {
    category: { view: true, add: true, edit: true, delete: true },
    product: { view: true },
    role: {},
    account: {},
    settings: { view: true, edit: true },
  },
};

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [backupPermissions, setBackupPermissions] = useState(initialPermissions);

  // Xử lý thay đổi quyền
  const handlePermissionChange = (role, module, action) => {
    const roleKey = roleKeys[role];
    const actionKey = actionKeys[action];
    const newValue = !permissions[roleKey]?.[module]?.[actionKey];
    const updatedPermissions = { ...permissions };

    if (!updatedPermissions[roleKey][module]) {
      updatedPermissions[roleKey][module] = {};
    }
    updatedPermissions[roleKey][module][actionKey] = newValue;

    if (newValue && (actionKey === "delete" || actionKey === "edit")) {
      updatedPermissions[roleKey][module].view = true;
    } else if (!newValue && actionKey === "view") {
      updatedPermissions[roleKey][module] = { view: false, add: false, edit: false, delete: false };
    }

    setPermissions(updatedPermissions);
  };

  // Chọn tất cả quyền cho một vai trò
  const handleSelectAllForRole = (role) => {
    const roleKey = roleKeys[role];
    const allChecked = modules.every((module) =>
      (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).every(
        (action) => permissions[roleKey]?.[module.name]?.[actionKeys[action]]
      )
    );

    const updatedPermissions = { ...permissions };
    updatedPermissions[roleKey] = Object.fromEntries(
      modules.map((module) => [
        module.name,
        Object.fromEntries(
          (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).map((action) => [
            actionKeys[action], !allChecked
          ])
        )
      ])
    );

    setPermissions(updatedPermissions);
  };

  // Hoàn tác các thay đổi
  const handleUndoChanges = () => {
    setPermissions(backupPermissions);
  };

  // Lưu phân quyền
  const handleSave = () => {
    setBackupPermissions(permissions);
    console.log("Phân quyền đã lưu:", permissions);
    alert("Phân quyền đã được lưu thành công!");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tính năng</TableCell>
              {roles.map((role) => (
                <TableCell key={role} align="center" sx={{ color: "white", fontWeight: "bold" }}>
                  {role}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Chọn tất cả</TableCell>
              {roles.map((role) => (
                <TableCell key={role} align="center">
                  <Tooltip title="Chọn tất cả">
                    <Checkbox
                      checked={modules.every((module) =>
                        (module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).every(
                          (action) => permissions[roleKeys[role]]?.[module.name]?.[actionKeys[action]]
                        )
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
                  <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }} colSpan={roles.length + 1}>
                    {module.label}
                  </TableCell>
                </TableRow>
                {(module.name === "settings" ? ["Xem", "Sửa"] : ["Xem", "Thêm", "Sửa", "Xóa"]).map((action) => (
                  <TableRow key={action} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>{action}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role} align="center">
                        <Checkbox
                          checked={permissions[roleKeys[role]]?.[module.name]?.[actionKeys[action]] || false}
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleUndoChanges} startIcon={<Undo />}>
          Hoàn tác
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave} startIcon={<Save />}>
          Lưu
        </Button>
      </Box>
    </Container>
  );
}
