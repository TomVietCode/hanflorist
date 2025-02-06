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
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton
import "./style.css";

const columns = (navigate, handleDelete) => [
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
          {params.row.title}
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
              navigate(`/admin/products/view/${params.row.id}`);
            }}
          >
            <VisibilityIcon className="icon" />
          </span>
          <span
            className="box_icon bi2"
            style={{ color: "#ffc107", border: "solid 1px #ffc107" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/edit/${params.row.id}`);
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
          }}
        >
          {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
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
  const [filteredData, setFilteredData] = useState([]); // Lưu trữ dữ liệu đã lọc
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const [loading, setLoading] = useState(true); // State để kiểm tra xem dữ liệu có đang tải không
  const [filterStatus, setFilterStatus] = useState(""); // Lưu trạng thái lọc
  const [filterSort, setFilterSort] = useState(""); // Lưu bộ lọc sắp xếp
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get(token, "/admin/products");
        if (result.data?.length) {
          const formattedData = result.data.map((row, index) => ({
            ...row,
            id: row._id,
            stt: index + 1,
            price: `${row.price.toLocaleString()} VND`,
          }));
          setData(formattedData);
          setFilteredData(formattedData); // Khi lấy dữ liệu xong, cập nhật filteredData
        }
        setLoading(false); // Đặt loading thành false khi đã tải xong dữ liệu
      } catch (err) {
        setError(err.message);
        setLoading(false); // Đặt loading thành false khi có lỗi
      }
    };
    fetchData();
  }, [token]);

  // Lọc dữ liệu mỗi khi `searchTerm`, `filterStatus`, hoặc `filterSort` thay đổi
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    if (filterSort) {
      if (filterSort === "DESC_PRICE") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      } else if (filterSort === "ASC_PRICE") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      }
    }

    setFilteredData(filtered);
  }, [searchTerm, data, filterStatus, filterSort]);

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (confirmDelete) {
      try {
        await del(token, `/admin/products/${id}`); // Gọi API xóa sản phẩm
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Cập nhật lại dữ liệu sau khi xóa
        setFilteredData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      } catch (err) {
        setError("Lỗi khi xóa sản phẩm");
      }
    }
  };

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{ color: "red", padding: "10px" }}>Error: {error}</div>
      )}
      <FilterBar 
        setSearchTerm={setSearchTerm} 
        setFilterStatus={setFilterStatus}
        setFilterSort={setFilterSort} 
      />
      {loading ? (
        // Hiển thị Skeleton khi dữ liệu đang tải
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <DataGrid
          rowHeight={90}
          rows={filteredData}
          columns={columns(navigate, handleDelete)} // Thêm handleDelete vào columns
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          paginationMode="server"
          onPaginationModelChange={(newPaginationModel) =>
            setPaginationModel(newPaginationModel)
          }
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
      )}
    </Paper>
  );
}
