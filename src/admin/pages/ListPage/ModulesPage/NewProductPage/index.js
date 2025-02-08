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
  Grid,
  Typography,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";

import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Editor } from "@tinymce/tinymce-react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

  const handleDeleteImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1); // Xóa ảnh tại vị trí index
    setProduct((prev) => ({ ...prev, images: updatedImages })); // Cập nhật lại state
  };

  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Cột bên trái */}
        <Grid item xs={12} md={8} sx={{ height: "10rem" }}>
          <Card sx={{ p: 0.5 }}>
            <CardContent>
              <Grid item xs={12} sx={{ marginBottom: "10px" }}>
                <Typography variant="h6" gutterBottom>
                  Tên sản phẩm{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </Typography>
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

              {/* mô tả */}
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
                    height: 190,
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
            </CardContent>
          </Card>
        </Grid>

        {/* Cột bên phải */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 0.5 }}>
            <CardContent>
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
                  Hình ảnh
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
                  {/* Ảnh lớn nhất */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "17.3rem",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      overflow: "hidden",
                      border:
                        product.images.length > 0
                          ? "2px solid #1565c0"
                          : "2px dashed #ccc",
                      position: "relative",
                      "&:hover .delete-icon": {
                        opacity: 1, // Hiện nút xóa khi hover
                      },
                    }}
                  >
                    {product.images.length > 0 ? (
                      <>
                        <img
                          src={product.images[0]}
                          alt="Main"
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        />
                        {/* Nút xóa ảnh chính */}
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            opacity: 0,
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                            transition: "opacity 0.3s ease",
                            zIndex: 2,
                          }}
                          className="delete-icon"
                          onClick={() => handleDeleteImage(0)}
                        >
                          <DeleteIcon sx={{ color: "white" }} />
                        </IconButton>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        display="flex"
                        alignItems="center"
                      >
                        {/* <AddCircleTwoToneIcon fontSize="large" sx={{ marginRight: 1 }} /> */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          display="flex"
                          alignItems="center"
                        >
                          <label
                            htmlFor="upload-image"
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <AddCircleTwoToneIcon
                              fontSize="large"
                              sx={{ marginRight: 1 }}
                            />
                          </label>
                          <input
                            type="file"
                            id="upload-image"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Typography>
                      </Typography>
                    )}
                  </Box>

                  {/* Nút tải ảnh lên */}
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={9}>
          <Card sx={{ p: 0.5 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
              </Grid>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                {/* Cột chọn danh mục */}
                <Grid item xs={5}>
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
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                        },
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

                {/* Cột checkbox sản phẩm nổi bật */}
                <Grid
                  item
                  xs={5}
                  display="flex"
                  justifyContent="center"
                  sx={{ marginTop: "2.1rem" }}
                >
                  <FormControlLabel
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "100px",
                      width: "12rem",
                      transition: "0.3s",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      userSelect: "none", // Chặn bôi đen chữ

                      "&:hover": {
                        borderColor: "#4CAF50", // Viền đổi màu khi hover
                        backgroundColor: "#f5f5f5", // Nền đổi màu nhẹ khi hover
                      },

                      "&.checked": {
                        backgroundColor: "#e8f5e9", // Đổi màu nền toàn bộ khi checkbox được chọn
                        borderColor: "#4CAF50", // Viền xanh lá khi được chọn
                      },
                    }}
                    control={
                      <Checkbox
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        icon={
                          <RadioButtonUncheckedIcon
                            sx={{ marginBottom: "1px" }}
                          />
                        }
                        checkedIcon={
                          <CheckCircleIcon
                            sx={{ color: "green", marginBottom: "1px" }}
                          />
                        }
                      />
                    }
                    label="Sản phẩm nổi bật"
                    className={isFeatured ? "checked" : ""}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Danh mục và trạng thái */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 0.5 }}>
            <CardContent>
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
                    border: "none",
                    height: "2.5rem",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
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
            </CardContent>
          </Card>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                marginTop: "1rem",
                width: "12rem",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                borderRadius: "20px",

                "&:hover": {
                  backgroundColor: "#1565c0", // Hover effect color
                },
              }}
            >
              Thêm sản phẩm
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProductPage;
