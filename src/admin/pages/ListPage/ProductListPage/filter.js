import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Box,
  Grid,
  Button,
  FormControl,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import {
  useSearchStore,
  useResetStore,
  useStatusStore,
  useSortStore,
  useActionStore,
  useDeleteStore,
} from "../../../components/store";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import { get } from "../../../../share/utils/http";
import "./style.css";

// Define filter options constants
const FILTER_OPTIONS = {
  ALL: "default",
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Dừng hoạt động",
  DELETE_ALL: "Xóa tất cả",
};

const STATUS_OPTIONS = {
  ALL: "Tất cả",
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Dừng hoạt động",
};

const SORT_OPTIONS = {
  ALL: "default",
  DESC_STOCK: "Số lượng giảm dần",
  ASC_STOCK: "Số lượng tăng dần",
  NEWEST: "Mới nhất",
  OLDEST: "Cũ nhất",
};

const FilterBar = ({ setFilterStatus, setFilterSort, setSelectedProductIds }) => {
  const token = getLocalStorage("token");
  const [filterSort, setFilterSortLocal] = useState(SORT_OPTIONS.ALL);
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const navigate = useNavigate();

  // search
  const { setSearchTerm } = useSearchStore();
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTermLocal(value);
    setSearchTerm(value);
  };

  // lọc trạng thái
  const { statusTerm, setStatusTerm } = useStatusStore();
  const [filterStatus, setFilterStatusLocal] = useState("");
  useEffect(() => {
    if (statusTerm === "active") {
      setFilterStatusLocal("Đang hoạt động");
    } else if (statusTerm === "inactive") {
      setFilterStatusLocal("Dừng hoạt động");
    } else {
      setFilterStatusLocal("Tất cả");
    }
  }, [statusTerm]);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    let apiStatus = "";
    if (value === "Đang hoạt động") {
      apiStatus = "active";
    } else if (value === "Dừng hoạt động") {
      apiStatus = "inactive";
    } else {
      apiStatus = "";
    }
    setFilterStatusLocal(value);
    setStatusTerm(apiStatus);
    setFilterStatus(value); // Cập nhật prop nếu cần
  };

  // sort
  const { sortTerm, setSortTerm } = useSortStore();
  const handleSortChange = (event) => {
    const value = event.target.value;
    setFilterSortLocal(value);
    setSortTerm(value);
    setFilterSort(value); // Cập nhật prop nếu cần
  };

  // action
  const [filterAction, setFilterAction] = useState(FILTER_OPTIONS.ALL);
  const { selectedAction, setSelectedAction } = useActionStore();
  const handleActionChange = (event) => {
    setFilterAction(event.target.value);
    setSelectedAction(event.target.value);
  };

  // reset
  const { isActive, toggleActive } = useResetStore();
  const handleReset = useCallback(() => {
    // reset status
    setStatusTerm("");
    setFilterStatusLocal("Tất cả");
    setFilterStatus("Tất cả");
    // reset sort
    setFilterSortLocal("default");
    setSortTerm("");
    setFilterSort("default");
    // reset search
    setSearchTermLocal("");
    setSearchTerm("");
    // reset action
    setSelectedAction("default");
    setFilterAction("default");
    // reset selected products
    setSelectedProductIds([]); // Reset các ô tích chọn sản phẩm
    toggleActive(false); // Đặt lại trạng thái tránh vòng lặp vô hạn
  }, [
    setStatusTerm,
    setSearchTerm,
    toggleActive,
    setSelectedAction,
    setFilterStatus,
    setFilterSort,
    setSelectedProductIds,
  ]);

  useEffect(() => {
    if (isActive) {
      handleReset();
    }
  }, [isActive, handleReset]);

  // State cho số lượng sản phẩm đã xóa
  const [deletedCount, setDeletedCount] = useState(0);
  const { isDeleted, setDelete } = useDeleteStore();
  useEffect(() => {
    const fetchDeletedCount = async () => {
      try {
        const result = await get(token, "/admin/products?status=deleted");
        const deletedProducts = result.data || [];
        setDeletedCount(deletedProducts.length);
      } catch (err) {
        console.error("Failed to fetch deleted products:", err);
        setDeletedCount(0);
      }
    };
    fetchDeletedCount();
    if (isDeleted) {
      fetchDeletedCount();
      setDelete(false);
    }
  }, [token, isDeleted, setDelete]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/products/add-products")}
            sx={{
              height: "2.6rem",
              px: 2,
              fontSize: "18px",
              backgroundColor: "#1976d2",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#1565c0",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease",
              },
              "&:active": {
                backgroundColor: "#0d47a1",
                transform: "translateY(1px)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Thêm mới
          </Button>
        </Grid>
        <Grid item xs>
          <TextField
            placeholder="Nhập từ khóa"
            variant="outlined"
            size="small"
            value={searchTermLocal}
            onChange={handleSearch}
            sx={{
              float: "right",
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
        </Grid>
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterStatus}
              onChange={handleStatusChange}
              displayEmpty
              className={
                filterStatus === STATUS_OPTIONS.ACTIVE
                  ? "active"
                  : filterStatus === STATUS_OPTIONS.INACTIVE
                  ? "inactive"
                  : ""
              }
              sx={{
                borderRadius: 1,
                height: "2.6rem",
                width: "12rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem className="status-indicator-add" value={STATUS_OPTIONS.ALL}>
                Tất cả
              </MenuItem>
              <MenuItem
                className="status-indicator-add active"
                value={STATUS_OPTIONS.ACTIVE}
              >
                Đang hoạt động
              </MenuItem>
              <MenuItem
                className="status-indicator-add inactive"
                value={STATUS_OPTIONS.INACTIVE}
              >
                Dừng hoạt động
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <Select
              value={filterSort}
              onChange={handleSortChange}
              displayEmpty
              sx={{
                height: "2.8rem",
                width: "13rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem value={SORT_OPTIONS.ALL} disabled>
                Sắp xếp
              </MenuItem>
              <MenuItem value={SORT_OPTIONS.DESC_STOCK}>Số lượng giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_STOCK}>Số lượng tăng dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.NEWEST}>Mới nhất</MenuItem>
              <MenuItem value={SORT_OPTIONS.OLDEST}>Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <Select
              value={filterAction}
              onChange={handleActionChange}
              displayEmpty
              sx={{
                width: "12rem",
                height: "2.6rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem value={FILTER_OPTIONS.ALL} disabled>
                Chọn hành động
              </MenuItem>
              <MenuItem value={FILTER_OPTIONS.DELETE_ALL}>Xóa tất cả</MenuItem>
              <MenuItem value={FILTER_OPTIONS.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.INACTIVE}>Dừng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              minWidth: "auto",
              p: 1,
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          >
            <CachedIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/products/delete")}
            sx={{
              minWidth: "auto",
              p: 1,
              position: "relative",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          >
            <DeleteIcon />
            <Box
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                transform: "translate(50%, -50%)",
              }}
            >
              {deletedCount}
            </Box>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;