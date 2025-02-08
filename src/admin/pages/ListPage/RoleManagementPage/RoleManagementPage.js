import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Notification, { showConfirmDialog, showSuccess, showError } from "../../../components/Notification"; // Import Notification
import "./style.css";

const sampleData = [
  { id: 1, groupName: "Admin", description: "Quản trị viên hệ thống", totalMembers: 5 },
  { id: 2, groupName: "Editor", description: "Biên tập viên", totalMembers: 10 },
  { id: 3, groupName: "Viewer", description: "Người xem", totalMembers: 20 },
].map((row, index) => ({ ...row, index: index + 1 }));

const columns = (navigate, handleDelete) => [
  { field: "index", headerName: "STT", flex: 0.5, headerAlign: "center", align: "center" },
  { field: "groupName", headerName: "Nhóm quyền", flex: 1.5 },
  { field: "description", headerName: "Mô tả ngắn", flex: 2 },
  { field: "totalMembers", headerName: "Tổng thành viên", flex: 1, align: "center", headerAlign: "center" },
  {
    field: "actions",
    headerName: "Hành động",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Box sx={{ display: "flex" }}>
        <span
          className="box_icon bi2 fix_bi2"
          style={{
            color: "#ffc107",
            border: "solid 1px #ffc107",
            padding: "5px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/roles/edit-role`);
          }}
        >
          <BorderColorIcon className="icon" />
        </span>
        <span
          className="box_icon bi3"
          style={{
            color: "#dc3545",
            border: "solid 1px #dc3545",
            padding: "5px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(); // Call delete function
          }}
        >
          <DeleteIcon className="icon" />
        </span>
      </Box>
    ),
  },
];

export default function RoleGroupPage() {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [notificationState, setNotificationState] = useState({ open: false, severity: "", message: "" });
  const navigate = useNavigate();

  // Handle delete logic
  const handleDelete = () => {
    showConfirmDialog(
      "Bạn có chắc chắn muốn xóa?",
      () => {
        // Xóa thành công
        showSuccess("Xóa thành công!", setNotificationState);
        // Thực hiện xóa ở đây (ví dụ: gọi API để xóa dữ liệu)
      },
      () => {
        // Hủy xóa
        showError("Hủy xóa!", setNotificationState);
      }
    );
  };

  return (
    <Box>
      <Paper className="RoleGroupPage" sx={{ height: "100%", width: "100%", mt: 2, p: 2 }}>
        {/* Header + Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, padding: "10px" }}>
          <h2 style={{ margin: 0 }}>Quản lý nhóm quyền</h2>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/roles/new-role")}
            sx={{
              padding: "8px 15px",
              border: "solid 1px #ccc",
              minWidth: "auto",
              fontSize: "1rem",
            }}
          >
            Thêm mới
          </Button>
        </Box>

        {/* Data Grid */}
        <DataGrid
          className="custom-data-grid"
          rows={sampleData}
          columns={columns(navigate, handleDelete)}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          onPageChange={(newPage) => console.log(newPage)}
          sx={{
            "& .MuiDataGrid-cell": { display: "flex", alignItems: "center", cursor: "pointer" },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
            userSelect: "none",
          }}
        />
      </Paper>

      <Notification
        open={notificationState.open}
        severity={notificationState.severity}
        message={notificationState.message}
        onClose={() => setNotificationState({ ...notificationState, open: false })}
      />
    </Box>
  );
}
