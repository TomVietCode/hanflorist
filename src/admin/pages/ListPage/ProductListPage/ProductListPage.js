import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Thêm dòng này
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { get } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterBar from "./filter";
import "./style.css"; // Đúng// Import file CSS




const columns = [
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%", // Giới hạn chiều rộng
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          padding: "0 10px",
          overflow: "hidden", // Ẩn nội dung tràn
          fontSize:"17px",
        }}
        className="hover-cell"
      >
        {/* Phần title */}
        <span
          style={{
            transition: "transform 0.3s ease-in-out",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            cursor: "pointer",
          }}
          className="hover-title"
        >
          {params.row.title}
        </span>
        <span
          style={{
            position: "absolute",
            left: "10px",
            bottom: "-10px",
            display: "flex",
            gap: "5px",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
            padding: 5,
          }}
          className="hover-content"
        >
          <span
            className="box_icon bi1"
            style={{
              color:"#17a2b8",
              border: "solid 1px #17a2b8",
            }}
            // onClick={() => navigate(`/admin/products/view/${params.row.id}`)}
          >
            <VisibilityIcon className="icon"/>
          </span>
          <span
            className="box_icon bi2"
            style={{
              color:"#ffc107",
              border: "solid 1px #ffc107",
            }}
            onClick={() => alert(`Chỉnh sửa sản phẩm: ${params.row.title}`)}
          >
            <DeleteIcon className="icon"/>
          </span>
          <span
            className="box_icon bi3"
            style={{
              color:"#dc3545",
              border: "solid 1px #dc3545",
            }}
            onClick={() => alert(`Xóa sản phẩm: ${params.row.title}`)}
          >
            <BorderColorIcon className="icon"/>
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
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
  },
];

export default function ProductListPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get(token, "/admin/products");

        if (result.data && result.data.length > 0) {
          const processedData = result.data.map((row, index) => ({
            ...row,
            id: row._id,
            stt: index + 1,
            price: `${row.price.toLocaleString()} VND`,
          }));

          setData(processedData);
        }
      } catch (err) {
        setError(err.message);  
      }
    };

    fetchData();
  }, [token]);

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      <FilterBar/>
      <DataGrid
        rowHeight={90}
        rows={data}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        paginationMode="server"
        onPageChange={newPage => {console.log(newPage)}}
        sx={{
          "& .center-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
          userSelect: "none",
        }}
      />
    </Paper>
  );
}
