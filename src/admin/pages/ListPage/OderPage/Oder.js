import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Card,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import "./style.css";
import { get } from "../../../../share/utils/http";

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
    {[...Array(7)].map((_, index) => (
      <div
        key={index}
        style={{
          flex: 1,
          height: "30px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    ))}
  </div>
);

// Định nghĩa các cột cho DataGrid
const getColumns = (navigate, handleViewDetail) => [
  {
    field: "stt",
    headerName: "STT",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "id",
    headerName: "ID Đơn hàng",
    flex: 1.5,
    headerAlign: "center",
  },
  {
    field: "customerName",
    headerName: "Khách hàng",
    flex: 2,
    headerAlign: "center",
    renderCell: (params) => params.value || "Không có thông tin",
  },
  {
    field: "totalAmount",
    headerName: "Tổng tiền",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(params.value || 0),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const isCompleted = params.value === "completed";
      return (
        <span className={`status-indicator ${isCompleted ? "active" : "inactive"}`}>
          {isCompleted ? "Hoàn thành" : params.value || "Chưa xác định"}
        </span>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value ? new Date(params.value).toLocaleDateString("vi-VN") : "Không xác định",
  },
  {
    field: "actions",
    headerName: "Thao tác",
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "17px" }}>
        <span
          className="box_icon bi1"
          onClick={() => handleViewDetail(params.row.id)}
        >
          <VisibilityIcon className="icon" />
        </span>
      </div>
    ),
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const navigate = useNavigate();
  const token = getLocalStorage("token");

  // Lấy danh sách đơn hàng và ánh xạ tên khách hàng từ shippingInfo
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data1 = await get(token, "/admin/orders");
        const data = data1.data;

        const formattedData = Array.isArray(data)
          ? data.map((order, index) => ({
              ...order,
              id: order.orderCode,
              stt: index + 1,
              customerName: order.shippingInfo?.name || "Không có thông tin",
            }))
          : [];

        setOrders(formattedData);
        setFilteredOrders(formattedData);
        setError(null);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách đơn hàng");
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Lọc đơn hàng theo tên khách hàng
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Xử lý xem chi tiết đơn hàng
  const handleViewDetail = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Tiêu đề và ô tìm kiếm */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <TextField
          placeholder="Nhập tên khách hàng"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "250px", height: "40px" }} // Giảm chiều rộng ô tìm kiếm
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Lỗi: {error}
        </Typography>
      )}

      {/* Bảng đơn hàng */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <DataGrid
          rowHeight={70}
          rows={filteredOrders}
          columns={getColumns(navigate, handleViewDetail)}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 20]}
          paginationMode="client"
          onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
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
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              color: "#333",
              fontWeight: "bold",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
              padding: "0 16px",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            userSelect: "none",
            border: "none",
          }}
        />
      </Card>
    </Container>
  );
}