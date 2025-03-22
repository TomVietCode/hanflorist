import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import NotificationAndDialog, {
  showNotification,
} from "../../../../components/NotificationAndDialog/index.js";
import { useCategoryStore } from "../../../../components/store.js";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [category, setCategory] = useState({
    title: "",
    status: "active",
  });
  const [categories, setCategories] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/admin/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestBody = {
        title: category.title,
        status: category.status,
        createdBy: "admin",
        updatedBy: "admin",
      };
      if (selectedCategory?._id) {
        requestBody.parentId = selectedCategory._id;
      }

      const response = await fetch("http://localhost:3001/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Tạo mới danh mục thất bại");
      }

      showNotification(setNotification, "Tạo danh mục thành công", "success");
      setTimeout(() => navigate("/admin/categories"), 2000);
    } catch (error) {
      showNotification(
        setNotification,
        error.message || "Tạo danh mục thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const flattenCategories = (cats, depth = 0) => {
    let flat = [];
    cats.forEach((cat) => {
      flat.push({ ...cat, depth, isParent: !cat.parentId });
      if (cat.children && cat.children.length > 0) {
        flat = flat.concat(flattenCategories(cat.children, depth + 1));
      }
    });
    return flat;
  };

  const renderCategories = () => {
    const flatCategories = flattenCategories(categories);
    return flatCategories.map((category) => (
      <MenuItem
        key={category._id}
        value={category._id}
        sx={{
          pl: 2 + category.depth * 2,
          fontWeight: category.isParent ? "bold" : "normal",
          backgroundColor: selectedCategory?._id === category._id ? "#e3f2fd" : "inherit",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedCategory(category);
          setOpenSelect(false);
        }}
      >
        {category.title}
      </MenuItem>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>

          {/* Form nhập liệu */}
          <Grid container spacing={2}>
            {/* Tiêu đề danh mục */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tiêu đề danh mục <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={category.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề danh mục"
                variant="outlined"
                size="small"
                sx={{ bgcolor: "#fafafa" }}
              />
            </Grid>

            {/* Danh mục cha */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Danh mục cha
              </Typography>
              <FormControl fullWidth>
                <Select
                  open={openSelect}
                  onOpen={() => setOpenSelect(true)}
                  onClose={() => setOpenSelect(false)}
                  value={selectedCategory ? selectedCategory._id : ""}
                  displayEmpty
                  renderValue={() =>
                    selectedCategory
                      ? selectedCategory.title
                      : "Không chọn (Danh mục gốc)"
                  }
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: "#fafafa" }}
                >
                  <MenuItem
                    value=""
                    onClick={() => {
                      setSelectedCategory(null);
                      setOpenSelect(false);
                    }}
                  >
                    Không chọn (Danh mục gốc)
                  </MenuItem>
                  {renderCategories()}
                </Select>
              </FormControl>
            </Grid>

            {/* Trạng thái */}
           
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Trạng thái <span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="status"
                  value={category.status}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: "#fafafa" }}
                >
                  <MenuItem className="status-indicator active" value="active">Hoạt động</MenuItem>
                  <MenuItem className="status-indicator inactive" value="inactive">Dừng hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Nút hành động */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleSubmit}
                  disabled={loading || !category.title}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? "Đang thêm..." : "Thêm"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/admin/categories")}
                  sx={{ minWidth: 120 }}
                >
                  Hủy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Thông báo */}
      <NotificationAndDialog
        openNotification={notification.open}
        setOpenNotification={(value) =>
          setNotification((prev) => ({ ...prev, open: value }))
        }
        notificationMessage={notification.message}
        notificationSeverity={notification.severity}
        dialogOpen={false}
        setDialogOpen={() => {}}
        dialogTitle=""
        dialogMessage=""
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Container>
  );
};

export default AddCategoryPage;