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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { getLocalStorage } from "../../../../../share/hepler/localStorage.js";
import CategorySelect from "../../CategoryPage/CateforySelect.js";
import { useCategoryStore } from "../../../../components/store.js";
import "./style.css";

const AddProductPage = () => {
  const [isFeatured, setIsFeatured] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    status: "active",
    thumbnail: null,
  });
  const [error, setError] = useState(null);

  const { selectedCategory, clearSelectedCategory } = useCategoryStore();

  // Hàm kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      product.title.trim() !== "" && // Tên sản phẩm không rỗng
      product.description.trim() !== "" && // Mô tả không rỗng
      product.price.trim() !== "" && // Giá không rỗng
      product.quantity.trim() !== "" && // Số lượng không rỗng
      product.thumbnail !== null && // Có hình ảnh
      selectedCategory && selectedCategory._id && // Có danh mục được chọn
      product.status !== "" // Trạng thái không rỗng
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleDeleteImage = () => {
    setProduct((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = getLocalStorage("token");
    const path = "/admin/products";
    const baseUrl = "http://localhost:3001";

    if (!selectedCategory || !selectedCategory._id) {
      setError("Vui lòng chọn danh mục sản phẩm");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("discount", product.discount || "0");
    formData.append("stock", product.quantity);
    formData.append("categoryId", selectedCategory._id);
    formData.append("status", product.status);
    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        setError(null);
        setProduct({
          title: "",
          description: "",
          price: "",
          discount: "",
          quantity: "",
          status: "active",
          thumbnail: null,
        });
        setIsFeatured(false);
        clearSelectedCategory();
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      setError(error.message || "Tạo mới sản phẩm thất bại");
    }
  };

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
                  InputProps={{ style: { height: "2.5rem" } }}
                />
              </Grid>

              {/* Mô tả */}
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
                  onEditorChange={(content) =>
                    setProduct((prev) => ({ ...prev, description: content }))
                  }
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
                    forced_root_block: false,
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
                <Typography variant="h6" gutterBottom>
                  Hình ảnh Thumbnail{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "17.45rem",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: product.thumbnail
                      ? "2px solid #1565c0"
                      : "2px dashed #ccc",
                    position: "relative",
                    "&:hover .delete-icon": {
                      opacity: 1,
                    },
                  }}
                >
                  {product.thumbnail ? (
                    <>
                      <img
                        src={URL.createObjectURL(product.thumbnail)}
                        alt="Thumbnail"
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                      />
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
                        onClick={handleDeleteImage}
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
                      <label
                        htmlFor="upload-thumbnail"
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
                        id="upload-thumbnail"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Typography>
                  )}
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
                    onChange={handleChange}
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
                      endAdornment: (
                        <InputAdornment position="end">VND</InputAdornment>
                      ),
                      style: { height: "2.5rem" },
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
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      style: { height: "2.5rem" },
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
                    InputProps={{ style: { height: "2.5rem" } }}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={5}>
                  <CategorySelect />
                </Grid>
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
                      userSelect: "none",
                      "&:hover": {
                        borderColor: "#4CAF50",
                        backgroundColor: "#f5f5f5",
                      },
                      "&.checked": {
                        backgroundColor: "#e8f5e9",
                        borderColor: "#4CAF50",
                      },
                    }}
                    control={
                      <Checkbox
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        icon={<StarBorderIcon sx={{ marginBottom: "1px" }} />}
                        checkedIcon={
                          <StarIcon
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
                  <MenuItem className="status-indicator-add active" value="active">
                    Hoạt động
                  </MenuItem>
                  <MenuItem className="status-indicator-add inactive" value="inactive">
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
              onClick={handleSubmit}
              disabled={!isFormValid()} // Vô hiệu hóa nếu form không hợp lệ
              sx={{
                marginTop: "1rem",
                width: "12rem",
                fontSize: "1rem",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#1565c0" },
                "&.Mui-disabled": {
                  backgroundColor: "#bdbdbd", // Màu khi bị vô hiệu hóa
                  color: "#fff",
                },
              }}
            >
              Thêm sản phẩm
            </Button>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProductPage;