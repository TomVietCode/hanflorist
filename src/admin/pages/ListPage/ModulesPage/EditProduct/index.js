import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Editor } from "@tinymce/tinymce-react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategorySelect from "../../CategoryPage/CateforySelect.js";
import NotificationAndDialog, {
  showNotification,
} from "../../../../components/NotificationAndDialog/index.js"; // Import component thông báo
import "./style.css";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState("");

  // State cho thông báo
  const [openNotification, setOpenNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      setIsFeatured(data.data.isFeatured || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  useEffect(() => {
    setDescription(product?.description || "Chưa có mô tả");
  }, [product?.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        thumbnail: file,
      });
    }
  };

  const handleDeleteImage = () => {
    setProduct((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleEditorFocus = () => {
    if (description === "Chưa có mô tả") {
      setDescription("");
    }
  };

  const handleCategoryChange = (category) => {
    setProduct((prev) => ({ ...prev, category: category._id }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = "http://localhost:3001";
      const path = `/admin/products/${id}`;

      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", description);
      formData.append("price", product.price);
      formData.append("discountPercentage", product.discountPercentage || "0");
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("status", product.status || "active");
      formData.append("isFeatured", isFeatured);
      if (product.thumbnail && product.thumbnail instanceof File) {
        formData.append("thumbnail", product.thumbnail);
      }

      const response = await fetch(`${baseUrl}${path}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Sản phẩm đã được cập nhật:", result.data);
      setError(null);
      showNotification(setOpenNotification, "Cập nhật sản phẩm thành công", "success"); // Hiển thị thông báo thành công
      
      // Trì hoãn chuyển hướng để thông báo hiển thị trong 2 giây
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000); // Chuyển hướng sau 2 giây
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      setError(error.message || "Cập nhật sản phẩm thất bại");
      showNotification(
        setOpenNotification,
        error.message || "Cập nhật sản phẩm thất bại",
        "error"
      ); // Hiển thị thông báo lỗi
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !openNotification.open) {
    return (
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

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
                  value={product?.title || ""}
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
                  value={description}
                  onEditorChange={(content) => setDescription(content)}
                  onFocus={handleEditorFocus}
                  init={{
                    height: 190,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
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
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      border: product?.thumbnail
                        ? "2px solid #1565c0"
                        : "2px dashed #ccc",
                      position: "relative",
                      "&:hover .delete-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    {product?.thumbnail ? (
                      <>
                        <img
                          src={
                            product.thumbnail instanceof File
                              ? URL.createObjectURL(product.thumbnail)
                              : product.thumbnail
                          }
                          alt="Main"
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
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Typography>
                    )}
                  </Box>
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
                    value={product?.price || ""}
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
                    name="discountPercentage"
                    type="number"
                    value={product?.discountPercentage || "0"}
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
                    name="stock"
                    type="number"
                    value={product?.stock || ""}
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
                <Grid item xs={5}>
                  <CategorySelect onCategoryChange={handleCategoryChange} />
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
                  value={product?.status || ""}
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
                    product?.status === "active"
                      ? "active"
                      : product?.status === "inactive"
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
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              sx={{
                background: "#ffc107",
                marginTop: "1rem",
                width: "12rem",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#ffc107",
                },
              }}
            >
              Lưu sản phẩm
            </Button>
          </Grid>
          {error && !openNotification.open && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Component thông báo */}
      <NotificationAndDialog
        openNotification={openNotification.open}
        setOpenNotification={(value) =>
          setOpenNotification((prev) => ({ ...prev, open: value.open }))
        }
        notificationMessage={openNotification.message}
        notificationSeverity={openNotification.severity}
        dialogOpen={false} // Không cần dialog trong trang này
        setDialogOpen={() => {}} // Placeholder cho prop bắt buộc
        dialogTitle=""
        dialogMessage=""
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Container>
  );
};

export default EditProductPage;