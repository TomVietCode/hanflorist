import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { get } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterBar from "./filter";
import { useSearchStore, useStatusStore } from "../ProductListPage/store";
import "./style.css";

// Hàm bôi vàng từ khóa tìm kiếm
const highlightText = (text = "", searchTerm = "") => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const columns = (navigate, handleDelete, searchTerm) => [
  {
    field: "stt",
    headerName: "STT",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
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
            transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
            padding: 5,
          }}
        >
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
    field: "stock",
    headerName: "Số sản phẩm",
    flex: 1,
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
        <span className={`status-indicator ${isActive ? "active" : "inactive"}`}>
          {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
      );
    },
  },
  {
    field: "creatorName",
    headerName: "Tạo bởi",
    align: "center",
    flex: 1.2,
    headerAlign: "center",
  },
  {
    field: "updatedAt",
    headerName: "Cập nhật",
    align: "center",
    flex: 1,
    headerAlign: "center",
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
  },
];

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getLocalStorage("token");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const { statusTerm } = useStatusStore();
  const { searchTerm } = useSearchStore();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       let url = `/admin/products?search=${encodeURIComponent(searchTerm)};`;

  //       if (statusTerm !== "ALL") {
  //         url += `&status=${statusTerm}`;
  //       }

  //       const result = await get(token, url);
  //       console.log(result)
  //       if (result.data?.length) {
  //         const formattedData = result.data.map((row, index) => ({
  //           ...row,
  //           id: row._id,
  //           stt: index + 1,
  //           price: `${row.price.toLocaleString()} VND`,
  //         }));
  //         setData(formattedData);
  //       } else {
  //         setData([]);
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [token, searchTerm, statusTerm]);
 useEffect(() => {
  
   const fetchData = async () => {
     setLoading(true); // Đặt loading thành true khi bắt đầu gọi API
     try {
       let url = `/admin/categories?search=${encodeURIComponent(searchTerm)}`;
     
     if (statusTerm !== "ALL") { 
       url += `&status=${statusTerm}`;  // Chỉ thêm nếu không phải "Tất cả"
     }
     
       const result = await get(token, url);
       if (result.data?.length) {
         const formattedData = result.data.map((row, index) => ({
           ...row,
           id: row._id,
           stt: index + 1,
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
 }, [token, searchTerm, statusTerm]); // Gọi lại khi token, searchTerm hoặc isActive thay đổi
 

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      <FilterBar />
      <DataGrid
        rowHeight={90}
        rows={data}
        columns={columns(searchTerm)}
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        paginationMode="server"
        onPageChange={(newPage) => {
          console.log(newPage);
        }}
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
