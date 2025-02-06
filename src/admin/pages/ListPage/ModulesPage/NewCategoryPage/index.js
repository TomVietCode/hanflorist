import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import AddIcon from "@mui/icons-material/Add";
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
      <Grid container spacing={3} sx={{ p: 1 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tiêu đề{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Tiêu đề"
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

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Mô tả{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <Editor
                apiKey="n5h7bzsqjitms467t41qjuac0tthph4wjqvy7aj2a5pygbo8"
                value={product.description}
                init={{
                  height: 200,
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
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
                        maxHeight: 200,
                        overflowY: "auto",
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

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                width: "100%",
                maxWidth: 200,
                fontSize: "1rem",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "#1565c0", // Hover effect color
                },
              }}
            >
              Thêm danh mục
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProductPage;
