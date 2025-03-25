import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  TextField,
} from "@mui/material";
import { get, patch } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Filter from "./filter";
import NotificationAndDialog, {
  showNotification,
} from "../../../components/NotificationAndDialog/index.js";
import { useSearchStore } from "../../../components/store";

// Skeleton cho loading
const SkeletonRow = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f9f9f9",
    }}
  >
    <div style={{ flex: "2", width: "100px" }}>
      <div
        style={{
          width: "90%",
          height: "25px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    {[...Array(5)].map((_, i) => (
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

const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

const hasInactiveParent = (category, allCategories) => {
  if (!category.parentId) return false;
  const parent = allCategories.find((cat) => cat.id === category.parentId);
  if (!parent) return false;
  return (
    parent.status === "inactive" || hasInactiveParent(parent, allCategories)
  );
};

const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
};

const updateCategoryStatus = (categories, idToUpdate, newStatus) => {
  return categories.map((cat) => {
    if (cat.id === idToUpdate) {
      const updatedCat = { ...cat, status: newStatus };
      if (cat.children && cat.children.length > 0) {
        updatedCat.children = cat.children.map((child) => ({
          ...child,
          status: newStatus,
          children: updateCategoryStatus([child], child.id, newStatus)[0]
            .children,
        }));
      }
      return updatedCat;
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

// Hàm cập nhật tiêu đề danh mục trong danh sách
const updateCategoryTitle = (categories, idToUpdate, newTitle) => {
  return categories.map((cat) => {
    if (cat.id === idToUpdate) {
      return { ...cat, title: newTitle };
    }
    if (cat.children && cat.children.length > 0) {
      return {
        ...cat,
        children: updateCategoryTitle(cat.children, idToUpdate, newTitle),
      };
    }
    return cat;
  });
};

const filterCategoriesByStatus = (categories) => {
  return categories
    .filter((cat) => ["active", "inactive"].includes(cat.status))
    .map((cat) => ({
      ...cat,
      children: cat.children ? filterCategoriesByStatus(cat.children) : [],
    }));
};

// Hàm lọc danh mục theo từ khóa tìm kiếm
const filterCategoriesBySearch = (categories, searchTerm) => {
  const searchLower = searchTerm.toLowerCase().trim();
  return categories
    .filter((cat) =>
      cat.title.toLowerCase().includes(searchLower) ||
      (cat.children &&
        cat.children.some((child) =>
          filterCategoriesBySearch([child], searchLower).length > 0
        ))
    )
    .map((cat) => ({
      ...cat,
      children: cat.children
        ? filterCategoriesBySearch(cat.children, searchLower)
        : [],
    }));
};

const formatCategoryData = (categories) => {
  return categories.map((row) => ({
    ...row,
    id: row._id || row.id,
    children: row.children ? formatCategoryData(row.children) : [],
  }));
};

const CategoryRow = ({
  row,
  depth = 0,
  handleDelete,
  handleToggleStatus,
  handleEdit,
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
        <TableCell
          sx={{ width: "300px", padding: "8px", position: "relative" }}
        >
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
            onClick={() => {
              if (!isInactiveDueToParent) {
                handleToggleStatus(row.id, row.status);
              }
            }}
            style={{
              cursor: isInactiveDueToParent ? "not-allowed" : "pointer",
            }}
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
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              padding: 5,
            }}
          >
            <span
              className="box_icon bi2"
              style={{
                color: "#ffc107",
                border: "solid 1px #ffc107",
                cursor: isInactiveDueToParent ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                if (!isInactiveDueToParent) {
                  e.stopPropagation();
                  handleEdit(row); // Gọi hàm handleEdit thay vì navigate
                }
              }}
            >
              <BorderColorIcon className="icon" />
            </span>
            <span
              className="box_icon bi3"
              style={{
                color: "#dc3545",
                border: "solid 1px #dc3545",
                cursor: isInactiveDueToParent ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                if (!isInactiveDueToParent) {
                  e.stopPropagation();
                  handleDelete(row.id);
                }
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
                      key={child.id}
                      row={child}
                      depth={depth + 1}
                      handleDelete={handleDelete}
                      handleToggleStatus={handleToggleStatus}
                      handleEdit={handleEdit}
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
  const [data, setData] = useState([]); // Dữ liệu gốc từ server
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc để hiển thị
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
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State cho popup chỉnh sửa
  const [categoryToEdit, setCategoryToEdit] = useState(null); // Danh mục đang chỉnh sửa
  const [editTitle, setEditTitle] = useState(""); // Tiêu đề mới
  const token = getLocalStorage("token");
  const navigate = useNavigate();

  // Lấy searchTerm từ store
  const { searchTerm } = useSearchStore();

  // Hàm lấy dữ liệu từ server
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await get(token, `/admin/categories?search=`); // Có thể thêm query search nếu cần
      if (result.data?.length) {
        const formattedData = formatCategoryData(result.data);
        setData(filterCategoriesByStatus(formattedData));
        setFilteredData(filterCategoriesByStatus(formattedData)); // Ban đầu hiển thị toàn bộ
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm) {
      const filtered = filterCategoriesBySearch(data, searchTerm);
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu gốc
    }
  }, [searchTerm, data]);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    const category = findCategoryById(data, id);

    if (!category) {
      showNotification(setNotification, "Không tìm thấy danh mục!", "error");
      return;
    }

    if (category.totalProducts > 0) {
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

      const removeCategoryById = (categories, id) => {
        return categories.filter((cat) => {
          if (cat.id === id) return false;
          if (cat.children && cat.children.length > 0) {
            cat.children = removeCategoryById(cat.children, id);
          }
          return true;
        });
      };

      setData((prevData) =>
        removeCategoryById([...prevData], categoryToDelete)
      );
      showNotification(setNotification, "Xóa danh mục thành công!", "success");
    } catch (err) {
      showNotification(
        setNotification,
        err.message || "Xóa danh mục thất bại!",
        "error"
      );
    } finally {
      setDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!id) {
      showNotification(
        setNotification,
        "ID danh mục không hợp lệ!",
        "error"
      );
      return;
    }

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
          return [...updatedData];
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

  // Hàm xử lý khi nhấn vào nút chỉnh sửa
  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setEditTitle(category.title); // Đặt tiêu đề hiện tại vào input
    setEditDialogOpen(true);
  };

  // Hàm xử lý cập nhật danh mục
  const confirmEdit = async () => {
    if (!categoryToEdit || !editTitle.trim()) {
      showNotification(
        setNotification,
        "Tiêu đề danh mục không được để trống!",
        "error"
      );
      return;
    }

    try {
      const response = await patch(
        token,
        `/admin/categories/${categoryToEdit.id}`,
        { title: editTitle },
        { "Content-Type": "application/json" }
      );
      if (response.data) {
        setData((prevData) => {
          const updatedData = updateCategoryTitle(
            prevData,
            categoryToEdit.id,
            editTitle
          );
          return [...updatedData];
        });
        showNotification(
          setNotification,
          "Cập nhật danh mục thành công!",
          "success"
        );
      } else {
        throw new Error("Cập nhật danh mục thất bại!");
      }
    } catch (err) {
      showNotification(
        setNotification,
        err.message || "Cập nhật danh mục thất bại!",
        "error"
      );
    } finally {
      setEditDialogOpen(false);
      setCategoryToEdit(null);
      setEditTitle("");
    }
  };

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
            ) : filteredData.length > 0 ? (
              filteredData.map((row) => (
                <CategoryRow
                  key={row.id}
                  row={row}
                  handleDelete={handleDelete}
                  handleToggleStatus={handleToggleStatus}
                  handleEdit={handleEdit}
                  navigate={navigate}
                  allCategories={data}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu phù hợp
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
        onCancel={() => setDialogOpen(false)}
      />

      {/* Dialog cảnh báo danh mục chứa sản phẩm */}
      <Dialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
      >
        <DialogTitle>Cảnh báo: Danh mục chứa sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Danh mục <strong>{categoryWithProducts?.title}</strong> hiện đang
            chứa <strong>{categoryWithProducts?.totalProducts}</strong> sản
            phẩm. Bạn cần di chuyển tất cả sản phẩm sang danh mục khác trước khi
            xóa.
          </DialogContentText>
          {categoryWithProducts?.products?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Danh sách sản phẩm:
              </Typography>
              <List
                dense
                sx={{ maxHeight: "200px", overflowY: "auto", padding: 0 }}
              >
                {categoryWithProducts.products.map((product) => (
                  <ListItem key={product._id} sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      <ListItemText primary={product.title} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)} color="primary">
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

      {/* Dialog chỉnh sửa danh mục */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng nhập tiêu đề mới cho danh mục{" "}
            <strong>{categoryToEdit?.title}</strong>.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề danh mục"
            type="text"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmEdit}
            color="primary"
            variant="contained"
            disabled={!editTitle.trim()} // Vô hiệu hóa nút nếu tiêu đề trống
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}