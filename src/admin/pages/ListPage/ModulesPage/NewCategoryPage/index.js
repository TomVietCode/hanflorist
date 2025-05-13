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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import NotificationAndDialog, {
  showNotification,
} from "../../../../components/NotificationAndDialog/index.js";
import { get, post } from "../../../../../share/utils/http.js";
import "./style.css"; // Đảm bảo import file CSS nếu cần

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    title: "",
    status: "active",
  });
  const [categories, setCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");
  // Lấy thông tin người dùng hiện tại từ localStorage

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `/admin/categories`;
        const result = await get(token, url);
        setCategories(result.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  // Hàm kiểm tra form hợp lệ
  const isFormValid = () => {
    return (
      category.title.trim() !== "" && // Tiêu đề không rỗng
      category.status !== ""
    );
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Xử lý gửi form tạo danh mục
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!isFormValid()) {
        setLoading(false);
        return;
      }

      const requestBody = {
        title: category.title.trim(),
        status: category.status,
      };

      if (selectedParentCategory?._id) {
        requestBody.parentId = selectedParentCategory._id;
      }
      
      await post(token, "/admin/categories", requestBody);

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

  // Hàm làm phẳng danh mục để hiển thị phân cấp
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

  // Hàm render danh mục cha trong Select
  const renderCategories = () => {
    const flatCategories = flattenCategories(categories);
    if (flatCategories.length === 0) {
      return (
        <MenuItem disabled>
          <Typography variant="body2">Không có danh mục nào</Typography>
        </MenuItem>
      );
    }

    return flatCategories.map((category) => {
      const isSelected = selectedParentCategory?._id === category._id;
      const isParent = category.isParent;

      return (
        <MenuItem
          key={category._id}
          value={category._id}
          sx={{
            pl: 2 + category.depth * 2,
            fontWeight: isParent ? "bold" : "normal",
            backgroundColor: isSelected
              ? "#e3f2fd"
              : isParent
              ? "#f0f4f8"
              : "#fafafa",
            "&:hover": {
              backgroundColor: isParent ? "#e8eef4" : "#e0f7fa",
            },
            borderBottom: "1px solid #e0e0e0",
            transition: "background-color 0.2s ease",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedParentCategory(category);
            setOpenSelect(false);
          }}
        >
          <Typography
            variant="body2"
            sx={{ flexGrow: 1, whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {category.title}
          </Typography>
        </MenuItem>
      );
    });
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
                  value={selectedParentCategory?._id || ""}
                  displayEmpty
                  renderValue={() =>
                    categories.length === 0
                      ? "Không có danh mục"
                      : selectedParentCategory
                      ? selectedParentCategory.title
                      : "Không chọn (Danh mục gốc)"
                  }
                  variant="outlined"
                  size="small"
                  sx={{
                    bgcolor: "#fafafa",
                    borderRadius: 1,
                    height: "2.5rem",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                  }}
                  MenuProps={{
                    autoFocus: false,
                    PaperProps: {
                      sx: {
                        maxHeight: "300px",
                        overflowY: "auto",
                        width: "300px",
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                  }}
                >
                  <MenuItem
                    value=""
                    onClick={() => {
                      setSelectedParentCategory(null);
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
            <Grid item xs={3}>
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
                  className={
                    category.status === "active"
                      ? "status-indicator active"
                      : "status-indicator inactive"
                  }
                  sx={{
                    height: "2.5rem",
                    bgcolor: "#fafafa",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <MenuItem className="status-indicator active" value="active">
                    Đang hoạt động
                  </MenuItem>
                  <MenuItem className="status-indicator inactive" value="inactive">
                    Dừng hoạt động
                  </MenuItem>
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
                  disabled={!isFormValid()} // Vô hiệu hóa nếu form không hợp lệ
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