import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  InputAdornment 
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Editor } from "@tinymce/tinymce-react";
import SaveIcon from "@mui/icons-material/Save";
import "./style.css";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    images: [],
    title: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setProduct({
        ...product,
        images: files.map((file) => URL.createObjectURL(file)),
      });
    }
  };

 
  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tên sản phẩm{" "}
            <Typography component="span" color="error">
              *
            </Typography>
          </Typography>
          <Grid container spacing={3}>
            {/* Product Information */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Tên sản phẩm"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{
                  style: {
                    height: "2.5rem",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Mô tả{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <Editor
                apiKey="n5h7bzsqjitms467t41qjuac0tthph4wjqvy7aj2a5pygbo8"
                value={product.description}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar: `undo redo | formatselect | bold italic backcolor | 
                    alignleft aligncenter alignright alignjustify | 
                    bullist numlist outdent indent | removeformat | help`,
                }}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                Hình ảnh{" "}
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: 0.5, marginTop: "4px" }}
                >
                  (Tối đa 5 ảnh)
                </Typography>
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    overflow: "hidden",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt="Main"
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Ảnh chính
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {product.images.slice(1).map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        overflow: "hidden",
                        "&:hover": {
                          transform: "scale(1.05)",
                          transition: "transform 0.3s ease-in-out",
                        },
                      }}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${index}`}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  ))}
                  {product.images.length === 0 &&
                    Array.from({ length: 4 }).map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 100,
                          height: 100,
                          backgroundColor: "#e0e0e0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          "&:hover": {
                            transform: "scale(1.05)",
                            transition: "transform 0.3s ease-in-out",
                          },
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Ảnh {index + 2}
                        </Typography>
                      </Box>
                    ))}
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    maxWidth: 200,
                    "&:hover": {
                      backgroundColor: "#1565c0", // Hover effect color
                    },
                  }}
                  disabled={product.images.length >= 5} // Giới hạn số lượng ảnh tải lên là 5
                >
                  <CloudUploadIcon /> Tải ảnh lên
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={product.images.length >= 5}
                  />
                </Button>
              </Box>
            </Grid>

            {/* Pricing & Quantity */}
            <Grid item xs={2}>
              <Typography variant="h6" gutterBottom>
                Giá{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                name="price"
                type="number"
                value={product.price} 
                placeholder="Giá sản phẩm"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{
                  // Thêm đơn vị VND
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                  style: {
                    height: "2.5rem",
                  },
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Typography variant="h6" gutterBottom>
                Giảm giá
              </Typography>
              <TextField
                name="discount"
                type="number"
                value={product.discount}
                onChange={handleChange}
                placeholder="Giảm giá"
                sx={{
                  
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{
                  // Thêm đơn vị VND
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  style: {
                    height: "2.5rem",
                  },
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" gutterBottom>
                Số lượng{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                name="quantity"
                type="number"
                value={product.quantity}
                onChange={handleChange}
                placeholder="Số lượng"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{
                  style: {
                    height: "2.5rem",
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>
                Danh mục{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    height: "2.5rem",
                    
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Giới hạn chiều cao của menu
                        overflowY: "auto", // Thêm cuộn dọc nếu cần
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Chọn danh mục
                  </MenuItem>
                  <MenuItem value="flowers">Hoa tươi</MenuItem>
                  <MenuItem value="gifts">Quà tặng</MenuItem>
                  <MenuItem value="plants">Cây cảnh</MenuItem>
                  <MenuItem value="home_decor">Trang trí nhà cửa</MenuItem>
                  <MenuItem value="accessories">Phụ kiện</MenuItem>
                  <MenuItem value="beauty">Sắc đẹp</MenuItem>
                  <MenuItem value="toys">Đồ chơi</MenuItem>
                  <MenuItem value="stationery">Văn phòng phẩm</MenuItem>
                  <MenuItem value="outdoor">Ngoài trời</MenuItem>
                  <MenuItem value="electronics">Điện tử</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2.3}>
              <Typography variant="h6" gutterBottom>
                Trạng thái{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    height: "2.5rem",
                    
                  }}
                  className={
                    product.status === "active"
                      ? "active"
                      : product.status === "inactive"
                        ? "inactive"
                        : ""
                  }
                >
                  <MenuItem
                    className="status-indicator-add active"
                    value="active"
                  >
                    Hoạt động
                  </MenuItem>
                  <MenuItem
                    className="status-indicator-add inactive"
                    value="inactive"
                  >
                    Dừng hoạt động
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{
                  marginTop: "1rem",
                  width: "12rem",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#1565c0", // Hover effect color
                  },
                }}
              >
                Lưu sản phẩm
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddProductPage;
