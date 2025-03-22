import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { get, del } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterBar from "./filter";
import {
  useSearchStore,
  useResetStore,
  useStatusStore,
  useSortStore,
  useActionStore,
  useDeleteStore,
} from "../../../components/store";
import NotificationAndDialog, {
  showNotification,
  showConfirmDialog,
} from "../../../components/NotificationAndDialog/index.js"; // Import component thông báo và dialog
import "./style.css";

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
    <div style={{ flex: "0.5", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.2", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "2.5" }}>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          width: "80%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          marginTop: "10px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.2", display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          width: "80%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "0.9", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "50%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.7", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "80%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.5", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "60%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: "1.2", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "80%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
  </div>
);

// Hàm đánh dấu từ khớp với searchTerm
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const getColumns = (navigate, handleDelete, searchTerm, toggleStatus) => [
  {
    field: "stt",
    headerName: "STT",
    flex: 0.5,
    align: "center",
  },
  {
    field: "thumbnail",
    headerName: "Hình ảnh",
    cellClassName: "center-cell",
    flex: 1.2,
    headerAlign: "center",
    renderCell: (params) => (
      <img
        src={params.value}
        alt="image"
        style={{ width: 100, height: 100, objectFit: "cover", padding: 10 }}
      />
    ),
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    flex: 2.5,
    renderCell: (params) => (
      <div
        className="hover-cell"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          padding: "0 10px",
          overflow: "hidden",
          fontSize: "17px",
        }}
      >
        <span
          className="hover-title"
          style={{
            transition: "transform 0.3s ease-in-out",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            cursor: "pointer",
          }}
        >
          {highlightText(params.row.title, searchTerm)}
        </span>
        <span
          className="hover-content"
          style={{
            position: "absolute",
            left: "10px",
            bottom: "-10px",
            display: "flex",
            gap: "5px",
            opacity: 0,
            transition:
              "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
            padding: 5,
          }}
        >
          <span
            className="box_icon bi1"
            style={{width:"2.5rem" , color: "#17a2b8", border: "solid 1px #17a2b8" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/view-products/${params.row.id}`);
            }}
          >
            <VisibilityIcon className="icon" />
          </span>
          <span
            className="box_icon bi2"
            style={{width:"2.5rem" , color: "#ffc107", border: "solid 1px #ffc107" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/edit-products/${params.row.id}`);
            }}
          >
            <BorderColorIcon className="icon" />
          </span>
          <span
            className="box_icon bi3"
            style={{ width:"2.5rem" , color: "#dc3545", border: "solid 1px #dc3545" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id);
            }}
          >
            <DeleteIcon className="icon" />
          </span>
        </span>
      </div>
    ),
    cellClassName: "hover-cell",
  },
  {
    field: "price",
    headerName: "Giá",
    flex: 1.2,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "stock",
    headerName: "Số lượng",
    flex: 0.9,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Trạng thái",
    align: "center",
    flex: 1.7,
    headerAlign: "center",
    renderCell: (params) => {
      const isActive = params.value === "active";
      return (
        <span
          className={`status-indicator ${isActive ? "active" : "inactive"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(params.row.id);
          }}
        >
          {isActive ? "Đang hoạt động" : "Dừng hoạt động"}
        </span>
      );
    },
  },
  {
    field: "creatorName",
    headerName: "Tạo bởi",
    align: "center",
    flex: 1.5,
    headerAlign: "center",
  },
  {
    field: "updatedAt",
    headerName: "Cập nhật",
    align: "center",
    flex: 1.2,
    headerAlign: "center",
    renderCell: (params) => new Date(params.value).toLocaleDateString("vi-VN"),
  },
];

export default function ProductListPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSort, setFilterSort] = useState("");
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const navigate = useNavigate();
  const { searchTerm } = useSearchStore();
  const { statusTerm } = useStatusStore();
  const { setDelete } = useDeleteStore();
  const { isActive } = useResetStore();
  const { sortTerm } = useSortStore();
  const { selectedAction } = useActionStore();
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // State cho thông báo
  const [openNotification, setOpenNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State cho dialog xác nhận
  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  // Hàm xóa sản phẩm với xác nhận
  const handleDelete = (id) => {
    showConfirmDialog(
      setDialogOpen,
      "Xác nhận xóa sản phẩm",
      "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      async () => {
        try {
          const response = await del(token, `/admin/products/${id}`);
          if (response.data === true) {
            setData((prevData) => prevData.filter((item) => item._id !== id));
            setDelete(true);
            showNotification(setOpenNotification, "Xóa sản phẩm thành công", "success");
          } else {
            showNotification(setOpenNotification, "Xóa sản phẩm thất bại", "error");
          }
        } catch (err) {
          showNotification(setOpenNotification, err.message || "Xóa sản phẩm thất bại", "error");
        }
      },
      () => {
        showNotification(setOpenNotification, "Hủy xóa sản phẩm", "info");
      }
    );
  };

  // Hàm thay đổi trạng thái sản phẩm với xác nhận
  const toggleStatus = (id) => {
    const currentStatus = data.find((item) => item._id === id).status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    showConfirmDialog(
      setDialogOpen,
      "Xác nhận thay đổi trạng thái",
      `Bạn có muốn thay đổi trạng thái sản phẩm thành "${newStatus === "active" ? "Đang hoạt động" : "Dừng hoạt động"}" không?`,
      async () => {
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
        try {
          const response = await fetch(
            `http://localhost:3001/admin/products/${id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: newStatus }),
            }
          );
          if (!response.ok) {
            throw new Error("Không thể cập nhật trạng thái!");
          }
          showNotification(setOpenNotification, "Cập nhật trạng thái thành công", "success");
        } catch (error) {
          setData((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, status: currentStatus } : item
            )
          );
          showNotification(setOpenNotification, error.message || "Cập nhật trạng thái thất bại", "error");
        }
      },
      () => {
        showNotification(setOpenNotification, "Hủy thay đổi trạng thái", "info");
      }
    );
  };

  // Hàm sắp xếp dữ liệu
  const sortData = (data, sortTerm) => {
    switch (sortTerm) {
      case "Số lượng giảm dần":
        return [...data].sort((a, b) => b.stock - a.stock);
      case "Số lượng tăng dần":
        return [...data].sort((a, b) => a.stock - b.stock);
      case "Mới nhất":
        return [...data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      case "Cũ nhất":
        return [...data].sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        );
      default:
        return data;
    }
  };

  // Hàm xử lý cập nhật trạng thái hàng loạt với xác nhận
  const handleBulkStatusUpdate = async () => {
    if (!selectedProductIds.length) {
      showNotification(setOpenNotification, "Vui lòng chọn ít nhất một sản phẩm", "warning");
      return;
    }

    const newStatus =
      selectedAction === "Đang hoạt động" ? "active" : "inactive";
    showConfirmDialog(
      setDialogOpen,
      "Xác nhận cập nhật trạng thái hàng loạt",
      `Bạn có muốn cập nhật trạng thái của ${selectedProductIds.length} sản phẩm thành "${selectedAction}" không?`,
      async () => {
        setData((prev) =>
          prev.map((item) =>
            selectedProductIds.includes(item._id)
              ? { ...item, status: newStatus }
              : item
          )
        );
        try {
          const response = await fetch(`http://localhost:3001/admin/products/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ids: selectedProductIds,
              updates: { status: newStatus },
            }),
          });
          if (!response.ok) {
            throw new Error("Không thể cập nhật trạng thái hàng loạt!");
          }
          showNotification(
            setOpenNotification,
            "Cập nhật trạng thái hàng loạt thành công",
            "success"
          );
        } catch (error) {
          showNotification(
            setOpenNotification,
            error.message || "Cập nhật trạng thái hàng loạt thất bại",
            "error"
          );
        }
      },
      () => {
        showNotification(
          setOpenNotification,
          "Hủy cập nhật trạng thái hàng loạt",
          "info"
        );
      }
    );
  };

  // Xử lý khi có hành động cập nhật trạng thái hàng loạt
  useEffect(() => {
    if (selectedAction && selectedProductIds.length > 0) {
      handleBulkStatusUpdate();
    }
  }, [selectedAction, selectedProductIds, token]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/admin/products?search=${encodeURIComponent(
          searchTerm
        )}&status=${statusTerm}&sort=${encodeURIComponent(sortTerm)}`;
        const result = await get(token, url);
        if (result.data?.length) {
          let formattedData = result.data.map((row, index) => ({
            ...row,
            id: row._id,
            stt: index + 1,
            price: `${row.price.toLocaleString()} VND`,
          }));
          formattedData = sortData(formattedData, sortTerm);
          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (err) {
        showNotification(
          setOpenNotification,
          err.message || "Lấy dữ liệu thất bại",
          "error"
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, searchTerm, isActive, statusTerm, sortTerm]);

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{ color: "red", padding: "10px" }}>Error: {error}</div>
      )}
      <FilterBar setFilterStatus={setFilterStatus} setFilterSort={setFilterSort} />
      <DataGrid
        rowHeight={90}
        rows={data}
        columns={getColumns(navigate, handleDelete, searchTerm, toggleStatus)}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => {
          setSelectedProductIds(ids);
        }}
        paginationMode="client"
        onPaginationModelChange={(newPaginationModel) =>
          setPaginationModel(newPaginationModel)
        }
        loading={loading}
        slots={{
          loadingOverlay: () => (
            <div>
              {[...Array(5)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </div>
          ),
        }}
        sx={{
          "& .center-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
          userSelect: "none",
        }}
      />

      {/* Component thông báo và dialog */}
      <NotificationAndDialog
        openNotification={openNotification.open}
        setOpenNotification={(value) =>
          setOpenNotification((prev) => ({ ...prev, open: value.open }))
        }
        notificationMessage={openNotification.message}
        notificationSeverity={openNotification.severity}
        dialogOpen={dialogOpen.open}
        setDialogOpen={(value) =>
          setDialogOpen((prev) => ({ ...prev, open: value.open }))
        }
        dialogTitle={dialogOpen.title}
        dialogMessage={dialogOpen.message}
        onConfirm={dialogOpen.onConfirm}
        onCancel={dialogOpen.onCancel}
      />
    </Paper>
  );
}