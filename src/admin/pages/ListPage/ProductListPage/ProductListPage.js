import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { get, del } from "../../../../share/utils/http"; // Thêm hàm remove
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterBar from "./filter";
import { useSearchStore, useResetStore, useStatusStore } from "./store";
import "./style.css";

const SkeletonRow = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      borderBottom: "1px solid #e0e0e0", // Đường viền dưới
      backgroundColor: "#f9f9f9", // Màu nền nhạt
    }}
  >
    {/* Skeleton cho cột STT */}
    <div style={{ flex: "0.5", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite", // Hiệu ứng nhấp nháy
        }}
      />
    </div>
    {/* Skeleton cho cột Hình ảnh */}
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
    {/* Skeleton cho cột Tiêu đề */}
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
    {/* Skeleton cho cột Giá */}
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
    {/* Skeleton cho cột Số lượng */}
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
    {/* Skeleton cho cột Trạng thái */}
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
    {/* Skeleton cho cột Tạo bởi */}
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
    {/* Skeleton cho cột Cập nhật */}
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
  if (!searchTerm) return text; // Nếu không có searchTerm, trả về text gốc

  // Tạo regex để tìm kiếm không phân biệt hoa thường
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
            style={{ color: "#17a2b8", border: "solid 1px #17a2b8" }}
            onClick={(e) => {
              e.stopPropagation(); // Ngừng sự kiện để không thay đổi trạng thái checkbox
              navigate(`/admin/products/view-products/${params.row.id}`);
            }}
          >
            <VisibilityIcon className="icon" />
          </span>
          <span
            className="box_icon bi2"
            style={{ color: "#ffc107", border: "solid 1px #ffc107" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/edit-products/${params.row.id}`);
            }}
          >
            <BorderColorIcon className="icon" />
          </span>
          <span
            className="box_icon bi3"
            style={{ color: "#dc3545", border: "solid 1px #dc3545" }}
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
            toggleStatus(params.row.id); // Gọi toggleStatus với id của hàng
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
  const [data, setData] = useState([]); // Lưu trữ dữ liệu chưa lọc
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State để kiểm tra xem dữ liệu có đang tải không
  const [filterStatus, setFilterStatus] = useState(""); // Lưu trạng thái lọc
  const [filterSort, setFilterSort] = useState(""); // Lưu bộ lọc sắp xếp
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const navigate = useNavigate();
  const { searchTerm } = useSearchStore();
  const { statusTerm } = useStatusStore();

  const handleDelete = async (id) => {
    try {
      const response = await del(token, `/admin/products/${id}`);
      console.log("API Response:", response);
      if (response.data === true) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
      } else {
        console.error("Delete failed:", response);
        setError("Xóa sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const toggleStatus = async (id) => {
    // Cập nhật trạng thái ngay trên UI trước khi gửi API
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
      )
    );

    // Gửi API cập nhật trạng thái
    try {
      const response = await fetch(`http://localhost:3001/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: data.find((item) => item._id === id).status === "active" ? "inactive" : "active",
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      // Nếu API lỗi, rollback trạng thái về ban đầu
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
        )
      );
    }
  };
  const { isActive } = useResetStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Đặt loading thành true khi bắt đầu gọi API
      try {
        let url = `/admin/products?search=${encodeURIComponent(searchTerm)}`;
        if (statusTerm !== "ALL") {
          url += `&status=${statusTerm}`; // Chỉ thêm nếu không phải "Tất cả"
        }
        const result = await get(token, url);
        if (result.data?.length) {
          const formattedData = result.data.map((row, index) => ({
            ...row,
            id: row._id,
            stt: index + 1,
            price: `${row.price.toLocaleString()} VND`,
          }));
          setData(formattedData);
        } else {
          setData([]); // Nếu không có dữ liệu, đặt danh sách về rỗng
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Đảm bảo loading luôn được tắt sau khi gọi API
      }
    };

    fetchData();
  }, [token, searchTerm,isActive, statusTerm]); // Gọi lại khi token, searchTerm hoặc statusTerm thay đổi

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{ color: "red", padding: "10px" }}>Error: {error}</div>
      )}
      <FilterBar
        setFilterStatus={setFilterStatus}
        setFilterSort={setFilterSort}
      />
      <DataGrid
        rowHeight={90}
        rows={data}
        columns={getColumns(navigate, handleDelete, searchTerm, toggleStatus)}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        paginationMode="server"
        onPaginationModelChange={(newPaginationModel) =>
          setPaginationModel(newPaginationModel)
        }
        loading={loading} // Hiển thị loading overlay khi loading là true
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
    </Paper>
  );
}