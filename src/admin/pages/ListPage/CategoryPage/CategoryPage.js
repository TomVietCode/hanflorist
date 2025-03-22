import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { get, patch } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Filter from "./filter";
import NotificationAndDialog, {
  showNotification,
} from "../../../components/NotificationAndDialog/index.js";

// Skeleton cho loading
const SkeletonRow = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f9f9f9",
    }}
  >
    <div style={{ flex: "2", width: "300px" }}>
      <div
        style={{
          width: "100%",
          height: "25px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          width: "150px",
        }}
      >
        <div
          style={{
            width: "80%",
            height: "25px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            animation: "pulse 1.5s infinite",
          }}
        />
      </div>
    ))}
  </div>
);

// Hàm format ngày
const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

// Hàm kiểm tra xem danh mục có cha nào "inactive" không
const hasInactiveParent = (category, allCategories) => {
  if (!category.parentId) return false;

  const flatCategories = allCategories.reduce((acc, cat) => {
    acc.push(cat);
    if (cat.children && cat.children.length > 0) {
      acc.push(...cat.children);
    }
    return acc;
  }, []);

  let currentCategory = category;
  while (currentCategory.parentId) {
    const parent = flatCategories.find(
      (cat) => cat.id === currentCategory.parentId
    );
    if (!parent) break;
    if (parent.status === "inactive") return true;
    currentCategory = parent;
  }
  return false;
};

// Hàm cập nhật trạng thái đệ quy
const updateCategoryStatus = (categories, idToUpdate, newStatus) => {
  return categories.map((cat) => {
    if (cat.id === idToUpdate) {
      return {
        ...cat,
        status: newStatus,
        children: cat.children?.map((child) => ({
          ...child,
          status: newStatus,
          children: updateCategoryStatus([child], child.id, newStatus)[0]
            .children,
        })) || [],
      };
    }
    if (cat.children && cat.children.length > 0) {
      return {
        ...cat,
        children: updateCategoryStatus(cat.children, idToUpdate, newStatus),
      };
    }
    return cat;
  });
};

// Hàm lọc danh mục chỉ hiển thị active và inactive
const filterCategoriesByStatus = (categories) => {
  return categories
    .filter((cat) => ["active", "inactive"].includes(cat.status))
    .map((cat) => ({
      ...cat,
      children: cat.children ? filterCategoriesByStatus(cat.children) : [],
    }));
};

// Component hiển thị danh mục
const CategoryRow = ({
  row,
  depth = 0,
  handleDelete,
  handleToggleStatus,
  navigate,
  isLastChild = false,
  allCategories,
}) => {
  const [open] = useState(true);
  const hasChildren = row.children && row.children.length > 0;
  const isInactiveDueToParent = hasInactiveParent(row, allCategories);

  const renderIndentation = () => {
    const indentations = [];
    for (let i = 0; i < depth; i++) {
      indentations.push(
        <Box
          key={`indent-${i}`}
          component="span"
          sx={{
            display: "inline-block",
            width: "30px",
            height: "100%",
            borderLeft: i < depth - 1 ? "2px solid #e0e0e0" : "none",
            position: "relative",
          }}
        />
      );
    }
    if (depth > 0) {
      indentations.push(
        <Box
          key={`connector-${depth}`}
          component="span"
          sx={{
            display: "inline-block",
            width: "30px",
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: isLastChild ? "50%" : "100%",
              width: "2px",
              borderLeft: "2px solid #e0e0e0",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              width: "15px",
              height: "2px",
              borderBottom: "2px solid #e0e0e0",
              transform: "translateY(-50%)",
            }}
          />
        </Box>
      );
    }
    return (
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {indentations}
      </Box>
    );
  };

  return (
    <>
      <TableRow
        sx={{
          height: "52px",
          backgroundColor: depth === 0 ? "#e8ecef" : "#f5f5f5",
          "&:hover": { backgroundColor: depth === 0 ? "#d8dfe3" : "#f0f0f0" },
          borderBottom: "1px solid #e0e0e0",
          opacity: isInactiveDueToParent ? 0.5 : 1,
        }}
      >
        <TableCell sx={{ width: "300px", padding: "8px", position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {renderIndentation()}
            <Box
              component="span"
              sx={{ ml: 1, fontWeight: depth === 0 ? "bold" : "normal" }}
            >
              {row.title}
            </Box>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", padding: "8px" }}>
          <span
            className={`status-indicator ${
              row.status === "active" ? "active" : "inactive"
            }`}
            onClick={() =>
              !isInactiveDueToParent && handleToggleStatus(row.id, row.status)
            }
            style={{ cursor: isInactiveDueToParent ? "not-allowed" : "pointer" }}
          >
            {row.status === "active" ? "Đang hoạt động" : "Dừng hoạt động"}
          </span>
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", padding: "8px" }}>
          {row.createdBy?.name || "Không xác định"}
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", padding: "8px" }}>
          {row.createdAt ? formatDate(row.createdAt) : "Không xác định"}
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", padding: "8px" }}>
          {row.totalProducts || 0}
        </TableCell>
        <TableCell align="center" sx={{ width: "150px", padding: "8px" }}>
          <span
            style={{ display: "flex", justifyContent: "center", gap: "5px", padding: 5 }}
          >
            <span
              className="box_icon bi2"
              style={{ color: "#ffc107", border: "solid 1px #ffc107" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/categories/edit/${row.id}`);
              }}
            >
              <BorderColorIcon className="icon" />
            </span>
            <span
              className="box_icon bi3"
              style={{ color: "#dc3545", border: "solid 1px #dc3545" }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.id);
              }}
            >
              <DeleteIcon className="icon" />
            </span>
          </span>
        </TableCell>
      </TableRow>
      {hasChildren && (
        <TableRow sx={{ width: "100%" }}>
          <TableCell colSpan={6} sx={{ padding: 0, border: "none" }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table sx={{ width: "100%" }}>
                <TableBody>
                  {row.children.map((child, index) => (
                    <CategoryRow
                      key={child._id}
                      row={child}
                      depth={depth + 1}
                      handleDelete={handleDelete}
                      handleToggleStatus={handleToggleStatus}
                      navigate={navigate}
                      isLastChild={index === row.children.length - 1}
                      allCategories={allCategories}
                    />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default function CategoryListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryWithProducts, setCategoryWithProducts] = useState(null);
  const token = getLocalStorage("token");
  const navigate = useNavigate();

  // Xử lý xóa danh mục với xác nhận
  const handleDelete = async (id) => {
    const category = data.find((item) => item.id === id);

    if (category && category.children && category.children.length > 0) {
      showNotification(
        setNotification,
        "Không thể xóa danh mục có danh mục con!",
        "error"
      );
      return;
    }

    if (category && category.totalProducts > 0) {
      try {
        const response = await get(token, `/admin/products?categoryId=${id}`);
        const products = response.data || [];
        setCategoryWithProducts({ ...category, products });
        setProductDialogOpen(true);
      } catch (err) {
        showNotification(
          setNotification,
          "Lỗi khi lấy danh sách sản phẩm: " + err.message,
          "error"
        );
      }
      return;
    }

    setCategoryToDelete(id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3001/admin/categories/${categoryToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Xóa danh mục thất bại!");
      }

      const result = await response.json();
      if (result.data === true) {
        setData((prevData) =>
          prevData.filter((item) => item.id !== categoryToDelete)
        );
        showNotification(setNotification, "Xóa danh mục thành công!", "success");
      } else {
        showNotification(setNotification, "Xóa danh mục thất bại!", "error");
      }
    } catch (err) {
      showNotification(setNotification, err.message || "Xóa danh mục thất bại!", "error");
    } finally {
      setDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setCategoryToDelete(null);
  };

  const closeProductDialog = () => {
    setProductDialogOpen(false);
    setCategoryWithProducts(null);
  };

  // Xử lý chuyển đổi trạng thái
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await patch(
        token,
        `/admin/categories/${id}`,
        { status: newStatus },
        { "Content-Type": "application/json" }
      );

      if (response.data) {
        setData((prevData) => {
          const updatedData = updateCategoryStatus(prevData, id, newStatus);
          return updatedData;
        });
        showNotification(
          setNotification,
          `Đã chuyển trạng thái thành ${
            newStatus === "active" ? "Đang hoạt động" : "Dừng hoạt động"
          }!`,
          "success"
        );
      } else {
        throw new Error("Cập nhật trạng thái thất bại!");
      }
    } catch (err) {
      showNotification(
        setNotification,
        err.message || "Cập nhật trạng thái thất bại!",
        "error"
      );
    }
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/admin/categories?search=`;
        const result = await get(token, url);
        if (result.data?.length) {
          const formattedData = result.data.map((row) => ({
            ...row,
            id: row._id,
          }));
          // Lọc ngay khi lấy dữ liệu từ API
          const filteredData = filterCategoriesByStatus(formattedData);
          setData(filteredData);
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{ color: "red", padding: "10px" }}>Error: {error}</div>
      )}
      <Filter />
      <TableContainer>
        <Table sx={{ border: "1px solid #e0e0e0", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: "300px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Tên danh mục
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: "150px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: "150px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Tạo bởi
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: "150px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Ngày tạo
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: "150px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Số lượng sản phẩm
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: "150px",
                  borderRight: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <SkeletonRow />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((row) => (
                <CategoryRow
                  key={row.id}
                  row={row}
                  handleDelete={handleDelete}
                  handleToggleStatus={handleToggleStatus}
                  navigate={navigate}
                  allCategories={data}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xác nhận xóa */}
      <NotificationAndDialog
        openNotification={notification.open}
        setOpenNotification={(value) =>
          setNotification((prev) => ({ ...prev, open: value }))
        }
        notificationMessage={notification.message}
        notificationSeverity={notification.severity}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogTitle="Xác nhận xóa"
        dialogMessage="Bạn có chắc chắn muốn xóa danh mục này không?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Dialog thông báo sản phẩm */}
      <Dialog open={productDialogOpen} onClose={closeProductDialog}>
        <DialogTitle>Cảnh báo: Danh mục chứa sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Danh mục <strong>{categoryWithProducts?.title}</strong> hiện đang chứa{" "}
            <strong>{categoryWithProducts?.totalProducts}</strong> sản phẩm. Bạn cần di chuyển
            tất cả sản phẩm sang danh mục khác trước khi xóa.
          </DialogContentText>
          {categoryWithProducts?.products?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Danh sách sản phẩm:
              </Typography>
              <List dense sx={{ maxHeight: "200px", overflowY: "auto" }}>
                {categoryWithProducts.products.map((product) => (
                  <ListItem key={product._id}>
                    <ListItemText
                      primary={product.title}
                      secondary={`Giá: ${product.price} VND`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProductDialog} color="primary">
            Đóng
          </Button>
          <Button
            onClick={() => navigate("/admin/products")}
            color="primary"
            variant="contained"
          >
            Quản lý sản phẩm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}