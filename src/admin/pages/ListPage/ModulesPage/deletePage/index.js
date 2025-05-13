import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { get, patch, del } from "../../../../../share/utils/http";
import { getLocalStorage } from "../../../../../share/hepler/localStorage";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  useSearchStore,
  useResetStore,
  useSortStore,
} from "../../../../components/store";
import FilterBar from "./filter";
import "./style.css";

// Tái sử dụng SkeletonRow từ trang gốc
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

// Tái sử dụng hàm highlightText
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

// Định nghĩa cột cho danh sách sản phẩm đã xóa
const getColumns = (navigate, handleRestore, handlePermanentDelete, searchTerm) => [
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
            className="box_icon restore"
            style={{ color: "#4caf50", border: "solid 1px #4caf50" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(params.row.id);
            }}
          >
            <RestoreIcon className="icon" />
          </span>
          <span
            className="box_icon deleted"
            style={{ color: "#dc3545", border: "solid 1px #dc3545" }}
            onClick={(e) => {
              e.stopPropagation();
              handlePermanentDelete(params.row.id);
            }}
          >
            <DeleteForeverIcon className="icon" />
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
    renderCell: () => <span className="status-indicator deleted">Đã xóa</span>,
  },
  {
    field: "creatorName",
    headerName: "Tạo bởi",
    align: "center",
    flex: 1.5,
    headerAlign: "center",
  },
  {
    field: "deletedAt",
    headerName: "Xóa vào",
    align: "center",
    flex: 1.2,
    headerAlign: "center",
    renderCell: (params) => new Date(params.value).toLocaleDateString("vi-VN"),
  },
];

export default function DeletedProductListPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5, // 5 sản phẩm mỗi trang
    page: 0, // Trang đầu tiên
  });
  const navigate = useNavigate();
  const { searchTerm } = useSearchStore();
  const { isActive } = useResetStore();
  const { sortTerm } = useSortStore();

  // Hàm khôi phục sản phẩm
  const handleRestore = async (id) => {
    try {
      await patch(token, `/admin/products/${id}`, {
        status: "active",
      });

      // Xóa sản phẩm khỏi danh sách sau khi khôi phục
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Lỗi khôi phục sản phẩm:", error);
      setError(error.message);
    }
  };

  // Hàm xóa vĩnh viễn sản phẩm
  const handlePermanentDelete = async (id) => {
    try {
      await del(token, `/admin/products/${id}`, {
        isHard: true,
      });

      // Xóa sản phẩm khỏi danh sách sau khi xóa vĩnh viễn
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Lỗi xóa vĩnh viễn sản phẩm:", error);
      setError(error.message);
    }
  };

  // Sắp xếp dữ liệu
  const sortData = (data, sortTerm) => {
    switch (sortTerm) {
      case "Số lượng giảm dần":
        return [...data].sort((a, b) => b.stock - a.stock);
      case "Số lượng tăng dần":
        return [...data].sort((a, b) => a.stock - b.stock);
      case "Mới nhất":
        return [...data].sort(
          (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
        );
      case "Cũ nhất":
        return [...data].sort(
          (a, b) => new Date(a.deletedAt) - new Date(b.deletedAt)
        );
      default:
        return data;
    }
  };

  // Lấy toàn bộ dữ liệu sản phẩm đã xóa (phân trang client)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/admin/products?search=${encodeURIComponent(
          searchTerm
        )}&status=deleted&sort=${encodeURIComponent(sortTerm)}`;
        const result = await get(token, url);
        if (result.data?.length) {
          let formattedData = result.data.map((row, index) => ({
            ...row,
            id: row._id,
            stt: index + 1, // STT không cần tính theo trang vì DataGrid tự phân trang
            price: `${row.price.toLocaleString()} VND`,
          }));
          formattedData = sortData(formattedData, sortTerm);
          setData(formattedData);
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
  }, [token, searchTerm, sortTerm]); // Không cần paginationModel trong dependency

  return (
    <Paper className="DeletedProductListPage" sx={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{ color: "red", padding: "10px" }}>Error: {error}</div>
      )}
      <FilterBar />
      <DataGrid
        rowHeight={90}
        rows={data}
        columns={getColumns(navigate, handleRestore, handlePermanentDelete, searchTerm)}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]} // Tùy chọn số sản phẩm mỗi trang
        paginationMode="client" // Phân trang phía client
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
    </Paper>
  );
}