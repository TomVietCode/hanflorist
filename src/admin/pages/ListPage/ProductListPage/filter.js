import React, { useState } from "react";
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
import "./style.css";

// Định nghĩa hằng số bộ lọc
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
  // State quản lý bộ lọc
  const [filterAction, setFilterAction] = useState(FILTER_OPTIONS.ALL);
  const [filterStatus, setFilterStatus] = useState(STATUS_OPTIONS.ALL);
  const [filterSort, setFilterSort] = useState(SORT_OPTIONS.ALL);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm, "với bộ lọc:", {
      filterAction,
      filterStatus,
      filterSort,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        {/* Nút Thêm mới */}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/products/add")}
            sx={{ height: "100%", px: 2 }}
          >
            Thêm mới
          </Button>
        </Grid>

        {/* Ô tìm kiếm */}
        <Grid item xs>
          <TextField
            placeholder="Nhập từ khóa"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              float: "right",
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#1976d2" },
            }}
          />
        </Grid>

        {/* Bộ lọc hành động */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              displayEmpty
              style={{
                height: "2.6rem"
              }}
            >
              <MenuItem value={FILTER_OPTIONS.ALL} disabled>Chọn hành động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.INACTIVE}>Dừng hoạt động</MenuItem>
              <MenuItem value={FILTER_OPTIONS.DELETE_ALL}>Xóa tất cả</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Bộ lọc trạng thái */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              displayEmpty
              style={{
                height: "2.6rem"
              }}
            >
              <MenuItem value={STATUS_OPTIONS.ALL}>Tất cả</MenuItem>
              <MenuItem value={STATUS_OPTIONS.ACTIVE} sx={{ color: "green" }}>Đang hoạt động</MenuItem>
              <MenuItem value={STATUS_OPTIONS.INACTIVE} sx={{ color: "red" }}>Dừng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Bộ lọc sắp xếp */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              displayEmpty
              style={{
                height: "2.6rem"
              }}
            >
              <MenuItem value={SORT_OPTIONS.ALL} disabled>Sắp xếp</MenuItem>
              <MenuItem value={SORT_OPTIONS.DESC_POSITION}>Vị trí giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_POSITION}>Vị trí tăng dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.DESC_PRICE}>Giá giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_PRICE}>Giá tăng dần</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Nút reset */}
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleSearch}
            sx={{ minWidth: "auto", p: 1 }}
          >
            <CachedIcon />
          </Button>
        </Grid>

        {/* Nút xóa với badge hiển thị số */}
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleSearch}
            sx={{ minWidth: "auto", p: 1, position: "relative" }}
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
