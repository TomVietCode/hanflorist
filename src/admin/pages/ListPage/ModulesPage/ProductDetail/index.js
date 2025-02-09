import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductById = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/admin/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setProduct(data.data);
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
    navigate(`/admin/products/view-products/${id}`);
  };

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80%" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80%" }}
      >
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh", // Chiều cao toàn màn hình
        overflow: "hidden",
      }}
    >
      <Grid container spacing={3} sx={{  maxWidth: "1200px" }}>
        {/* Hình ảnh */}
        <Grid item xs={12} md={4} sx={{ height: "600px" }}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: 3,
              height: "100%",
              display: "flex",
            }}
          >
            <CardMedia
              component="img"
              image={product?.thumbnail || "https://via.placeholder.com/400"}
              alt={product?.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Card>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={8} sx={{ height: "600px" }}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: 3,
              padding: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {product?.title}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  minHeight: "90px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 3,
                }}
              >
                {product?.description || "Chưa có mô tả"}
              </Typography>

              <Typography
                variant="h4"
                color="primary"
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.price)}
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Danh mục:</strong> {product?.slug}
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  label={
                    product?.status === "active"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"
                  }
                  color={product?.status === "active" ? "success" : "error"}
                  size="medium"
                />
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                <strong>Số lượng:</strong> {product?.stock}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                startIcon = {<BorderColorIcon sx={{marginBottom: "4px"}} />}
                sx={{
                  borderRadius: 2,
                  width: "10rem",
                  mt: 4,
                  fontSize: "14px",
                  background: "#ffc107",
                }}
              >
                Sửa sản phẩm
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
