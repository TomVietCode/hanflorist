import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
} from "@mui/material";
import { get } from "../../../../share/utils/http";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterBar from "./filter";
import { useSearchStore, useStatusStore } from "../ProductListPage/store";
import "./style.css";

const CategoryRow = ({ row, depth = 0, handleDelete, navigate, searchTerm }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: open ? "#f5f5f5" : "inherit",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <TableCell sx={{ paddingLeft: `${depth * 40}px` }}>
          {hasChildren && (
            <IconButton onClick={() => setOpen(!open)} size="small">
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {row.title} ({row.products})
        </TableCell>
        <TableCell>{row.featured ? "✅" : "❌"}</TableCell>
        <TableCell>{row.products} products</TableCell>
        <TableCell>
          <span className={`status-indicator ${row.status === "active" ? "active" : "inactive"}`}>
            {row.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
        </TableCell>
        <TableCell>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/edit-products/${row.id}`);
            }}
          >
            <BorderColorIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {hasChildren && (
        <TableRow>
          <TableCell colSpan={5} sx={{ padding: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" sx={{ backgroundColor: "#fafafa" }}>
                <TableBody>
                  {row.children.map((child) => (
                    <CategoryRow
                      key={child._id}
                      row={child}
                      depth={depth + 1}
                      handleDelete={handleDelete}
                      navigate={navigate}
                      searchTerm={searchTerm}
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

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getLocalStorage("token");
  const { statusTerm } = useStatusStore();
  const { searchTerm } = useSearchStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/admin/categories?search=${encodeURIComponent(searchTerm)}`;
        if (statusTerm !== "ALL") {
          url += `&status=${statusTerm}`;
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
          setData([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, searchTerm, statusTerm]);

  const handleDelete = (id) => {
    // Xử lý xóa ở đây
    console.log("Delete item with id:", id);
  };

  const navigate = (path) => {
    // Xử lý điều hướng ở đây
    console.log("Navigate to:", path);
  };

  return (
    <Paper className="ProductListPage" sx={{ height: "100%", width: "100%" }}>
      <FilterBar />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <CategoryRow
                key={row.id}
                row={row}
                handleDelete={handleDelete}
                navigate={navigate}
                searchTerm={searchTerm}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}