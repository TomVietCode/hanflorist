import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { styled } from "@mui/system";
import { get } from "../../../../../share/utils/http";
import "./style.css";

// Hàm để loại bỏ tất cả thẻ HTML và chỉ giữ nội dung văn bản thô
const stripHTML = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: "transform 0.2s ease-in-out",
}));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductById = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const data = await get(token, `/admin/products/${productId}`);
      setProduct(data.data);
      console.log(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/products/edit-products/${id}`);
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  // Calculate discounted price if discountPercentage exists
  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!discountPercentage || discountPercentage <= 0) return price;
    const discount = (price * discountPercentage) / 100;
    return price - discount;
  };

  // Format date for display
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Format price for display
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Calculate the discounted price
  const discountedPrice = calculateDiscountedPrice(
    product?.price || 0,
    product?.discountPercentage || 0
  );

  return (
    <Box sx={{ p: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Tiêu đề và nút quay lại */}
        <Grid container spacing={2.5}>
          {/* Hình ảnh sản phẩm */}
          <Grid item xs={12} md={5}>
            <StyledCard>
              <CardMedia
                component="img"
                image={product?.thumbnail || "https://via.placeholder.com/400"}
                alt={product?.title}
                sx={{
                  width: "100%",
                  height: "75vh",
                  objectFit: "cover",
                  borderRadius: "inherit",
                }}
              />
            </StyledCard>
          </Grid>

          {/* Thông tin chính */}
          <Grid item xs={12} md={7}>
            <StyledCard
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Tiêu đề sản phẩm */}
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {product?.title || "Không có tiêu đề"}
                </Typography>

                {/* Giá và giảm giá */}
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  {product?.discountPercentage > 0 ? (
                    <>
                      {/* Giá gốc (gạch ngang) */}
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {formatPrice(product?.price || 0)}
                      </Typography>
                      {/* Giá sau giảm giá với discount ở góc trên */}
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <Typography
                          variant="h5"
                          color="primary"
                          fontWeight={700}
                        >
                          {formatPrice(discountedPrice)}
                        </Typography>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "-10px", // Điều chỉnh vị trí lên trên
                            right: "-40px", // Điều chỉnh vị trí sang phải
                            backgroundColor: "red", // Màu đỏ cho discount
                            color: "white", // Chữ trắng để nổi bật
                            borderRadius: "100px", // Bo góc nhẹ
                            padding: "2px 6px", // Khoảng đệm bên trong
                            fontSize: "12px", // Kích thước chữ nhỏ hơn
                          }}
                        >
                          {`-${product.discountPercentage}%`}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="h5" color="primary" fontWeight={700}>
                      {formatPrice(product?.price || 0)}
                    </Typography>
                  )}
                </Stack>

                {/* Danh mục và trạng thái */}
                <Stack direction="row" spacing={2} mb={2}>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Danh mục:</strong>{" "}
                    {product?.categoryId?.title || "Chưa có"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ minWidth: "200px" }} // Khoảng cách cố định cho phần Trạng thái
                  >
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      className={`status-indicator ${
                        product?.status === "active" ? "active" : "inactive"
                      }`}
                    >
                      {product?.status === "active"
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </Typography>
                </Stack>

                {/* Số lượng tồn kho */}
                <Typography variant="body1" color="text.secondary" mb={2}>
                  <strong>Số lượng tồn kho:</strong> {product?.stock || 0}
                </Typography>

                {/* Người tạo và ngày tạo trên cùng một dòng */}
                {(product?.createdBy || product?.createdAt) && (
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Typography variant="body1" color="text.secondary">
                      <strong>Người tạo:</strong>{" "}
                      {product?.createdBy?.name || "Không xác định"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ minWidth: "200px" }} // Đảm bảo khoảng cách cố định cho phần Ngày
                    >
                      <strong>Ngày:</strong>{" "}
                      {product?.createdAt
                        ? formatDate(product.createdAt)
                        : "Không xác định"}
                    </Typography>
                  </Stack>
                )}

                {/* Người cập nhật và ngày cập nhật trên cùng một dòng */}
                {(product?.updatedBy || product?.updatedAt) && (
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Typography variant="body1" color="text.secondary">
                      <strong>Cập nhật:</strong>{" "}
                      {product?.updatedBy?.name || "Không xác định"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ minWidth: "200px" }} // Khoảng cách cố định cho phần Ngày
                    >
                      <strong>Ngày:</strong>{" "}
                      {product?.updatedAt
                        ? formatDate(product.updatedAt)
                        : "Không xác định"}
                    </Typography>
                  </Stack>
                )}

                {/* Mô tả sản phẩm */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Mô tả sản phẩm
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxHeight: 150,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    mb: 3,
                  }}
                >
                  {stripHTML(product?.description) || "Chưa có mô tả"}
                </Typography>
              </CardContent>

              {/* Button nằm dưới cùng */}
              <Box sx={{ p: 2.5, pt: 0, width: "18rem" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  startIcon={<BorderColorIcon />}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    fontSize: "1.2rem",
                    bgcolor: "#ffc107",
                  }}
                >
                  Sửa sản phẩm
                </Button>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
