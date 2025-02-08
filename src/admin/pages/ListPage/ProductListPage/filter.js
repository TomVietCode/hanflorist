import React, { useState, useEffect,useCallback  } from "react";
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
import { useSearchStore, useResetStore, useStatusStore } from "./store";

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
  DESC_POSITION: "Vị trí giảm dần",
  ASC_POSITION: "Vị trí tăng dần",
  DESC_PRICE: "Giá giảm dần",
  ASC_PRICE: "Giá tăng dần",
};

const FilterBar = () => {
  // Local state to manage filter values
  const [filterAction, setFilterActionLocal] = useState(FILTER_OPTIONS.ALL);
  const [filterSort, setFilterSortLocal] = useState(SORT_OPTIONS.ALL);
  const [searchTermLocal, setSearchTermLocal] = useState("");

  const navigate = useNavigate();

  // search
  const { setSearchTerm } = useSearchStore(); // Lấy setter từ Zustand
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTermLocal(value); // Cập nhật UI
    setSearchTerm(value); // Cập nhật Zustand store
  };

  // lọc trạng thái
  const { statusTerm, setStatusTerm } = useStatusStore(); // Zustand store
  const [filterStatus, setFilterStatus] = useState(""); // useState để cập nhật UI

  // Đồng bộ filterStatus với statusTerm khi trạng thái thay đổi
  useEffect(() => {
    if (statusTerm === "active") {
      setFilterStatus("Đang hoạt động");
    } else if (statusTerm === "inactive") {
      setFilterStatus("Dừng hoạt động");
    } else {
      setFilterStatus("Tất cả");
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
      apiStatus = "ALL"; // Trường hợp "Tất cả"
    }

    setFilterStatus(value); // Cập nhật UI
    setStatusTerm(apiStatus); // Cập nhật Zustand để gửi API
  };

  // reset
  const { isActive, setActive } = useResetStore(); // Truy cập Zustand

  const handleReset = useCallback(() => {
    setStatusTerm("ALL");
    setFilterStatus("Tất cả");
    setSearchTermLocal(""); // Cập nhật UI
    setSearchTerm("");
  }, [setStatusTerm, setSearchTerm]);
  
  useEffect(() => {
    handleReset();
  }, [isActive, handleReset]);
  

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        {/* Button to add a new item */}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/products/add-products")}
            sx={{ height: "2.6rem", px: 2 }}
          >
            Thêm mới
          </Button>
        </Grid>

        {/* Search Input */}
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

        {/* Filter for Status */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterStatus}
              onChange={handleStatusChange}
              displayEmpty
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                height: "2.6rem",
                width: "12rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem
                className="status-indicator-add"
                value={STATUS_OPTIONS.ALL}
              >
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

        {/* Filter for Sorting */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filterSort}
              displayEmpty
              sx={{
                height: "2.6rem",
                width: "11rem",
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
              <MenuItem value={SORT_OPTIONS.DESC_POSITION}>
                Vị trí giảm dần
              </MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_POSITION}>
                Vị trí tăng dần
              </MenuItem>
              <MenuItem value={SORT_OPTIONS.DESC_PRICE}>Giá giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_PRICE}>Giá tăng dần</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Filter for Action */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterAction}
              onChange={""} // Handle action change
              displayEmpty
              sx={{
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
              <MenuItem value={FILTER_OPTIONS.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.INACTIVE}>Dừng hoạt động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.DELETE_ALL}>Xóa tất cả</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
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

        {/* Delete Button with Badge */}
        <Grid item>
          <Button
            variant="outlined"
            onClick={""}
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
              5
            </Box>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;
