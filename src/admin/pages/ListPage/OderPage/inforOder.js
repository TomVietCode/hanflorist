import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./style.css";

// Component trang chi tiết đơn hàng
export default function OrderDetailPage() {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin chi tiết đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      // Kiểm tra orderId có hợp lệ không
      if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
        setError("ID đơn hàng không hợp lệ.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/admin/orders/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        const data1 = await response.json();
        const data = data1.data;
        console.log(orderId)

        // Kiểm tra xem data có tồn tại không
        if (!data) {
          throw new Error("Không tìm thấy đơn hàng.");
        }

        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">Đang tải...</Typography>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          {error || "Không tìm thấy đơn hàng"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          Vui lòng kiểm tra lại ID đơn hàng.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/orders")}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          Chi tiết đơn hàng
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/orders")}
        >
          Quay lại
        </Button>
      </Box>

      {/* Thông tin đơn hàng */}
      <Card sx={{ p: 3, mb: 4, borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Thông tin đơn hàng
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>ID Đơn hàng:</strong> {order._id || "Không có thông tin"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Khách hàng:</strong> {order.shippingInfo?.name || "Không có thông tin"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Tổng tiền:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.totalAmount || 0)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Trạng thái:</strong>{" "}
          {order.status === "completed" ? "Hoàn thành" : order.status || "Chưa xác định"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Ngày tạo:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("vi-VN")
            : "Không xác định"}
        </Typography>
      </Card>

      {/* Thông tin giao hàng */}
      <Card sx={{ p: 3, mb: 4, borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Thông tin giao hàng
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Tên người nhận:</strong> {order.shippingInfo?.name || "Khách"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Địa chỉ:</strong> {order.shippingInfo?.address || "Không có thông tin"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {order.shippingInfo?.email || "Không có thông tin"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Số điện thoại:</strong> {order.shippingInfo?.phone || "Không có thông tin"}
        </Typography>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card sx={{ p: 3, borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Danh sách sản phẩm
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center">
                  <strong>Hình ảnh</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Tên sản phẩm</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Giá</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Số lượng</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Thành tiền</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell align="center">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "4px" }}
                      />
                    </TableCell>
                    <TableCell align="center">{item.title || "Không có thông tin"}</TableCell>
                    <TableCell align="center">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price || 0)}
                    </TableCell>
                    <TableCell align="center">{item.quantity || 0}</TableCell>
                    <TableCell align="center">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.subtotal || 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}