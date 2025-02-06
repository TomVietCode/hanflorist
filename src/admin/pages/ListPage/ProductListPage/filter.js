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

const FilterBar = ({ setSearchTerm, setFilterAction, setFilterStatus, setFilterSort }) => {
  // Local state to manage filter values
  const [filterAction, setFilterActionLocal] = useState(FILTER_OPTIONS.ALL);
  const [filterStatus, setFilterStatusLocal] = useState(STATUS_OPTIONS.ALL);
  const [filterSort, setFilterSortLocal] = useState(SORT_OPTIONS.ALL);
  const [searchTermLocal, setSearchTermLocal] = useState("");

  const navigate = useNavigate();

  // Handle search action
  const handleSearch = () => {
    setSearchTerm(searchTermLocal); // Gửi từ khóa tìm kiếm lên component cha
  };

  // Handle filter action change
  const handleFilterActionChange = (e) => {
    const selectedAction = e.target.value;
    setFilterAction(selectedAction); // Cập nhật trạng thái lọc hành động
    setFilterActionLocal(selectedAction);
    if (selectedAction === FILTER_OPTIONS.DELETE_ALL) {
      // Thêm hành động khi chọn "Xóa tất cả"
      // Logic xóa sẽ thực hiện tại đây
      console.log("Xóa tất cả sản phẩm");
    }
  };

  // Handle filter status change
  const handleFilterStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus); // Cập nhật trạng thái lọc
    setFilterStatusLocal(selectedStatus);
  };

  // Handle filter sort change
  const handleFilterSortChange = (e) => {
    const selectedSort = e.target.value;
    setFilterSort(selectedSort); // Cập nhật trạng thái lọc sắp xếp
    setFilterSortLocal(selectedSort);
  };

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
            onChange={(e) => setSearchTermLocal(e.target.value)} // Update searchTermLocal
            sx={{
              float: "right",
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
        </Grid>

        {/* Filter for Action */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterAction}
              onChange={handleFilterActionChange} // Handle action change
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

        {/* Filter for Status */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterStatus}
              onChange={handleFilterStatusChange} // Handle status change
              displayEmpty
              sx={{
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
              <MenuItem className="status-indicator-add" value={STATUS_OPTIONS.ALL}>Tất cả</MenuItem>
              <MenuItem className="status-indicator-add active" value={STATUS_OPTIONS.ACTIVE} sx={{ color: "green" }}>
                Đang hoạt động
              </MenuItem>
              <MenuItem className="status-indicator-add inactive" value={STATUS_OPTIONS.INACTIVE} sx={{ color: "red" }}>
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
              onChange={handleFilterSortChange} // Handle sort change
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
              <MenuItem value={SORT_OPTIONS.DESC_POSITION}>Vị trí giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_POSITION}>Vị trí tăng dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.DESC_PRICE}>Giá giảm dần</MenuItem>
              <MenuItem value={SORT_OPTIONS.ASC_PRICE}>Giá tăng dần</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleSearch}
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
            onClick={handleSearch}
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
