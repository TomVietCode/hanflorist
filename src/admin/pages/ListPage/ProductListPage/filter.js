import React, { useState } from "react";
import { TextField, MenuItem, Box, Grid, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import "./style.css";

// Định nghĩa các hằng số cho giá trị value
const FILTER_OPTIONS = {
  ALL: "default",
  TATCA: "Tất cả",
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Dừng hoạt động",
  DELETE_ALL: "Xóa tất cả",
};

const OPTIONS = {
  ALL: "Tất cả",
  POSITION1: "Đang hoạt động",
  POSITION2: "Dừng hoạt động",
};

const SORT_OPTIONS = {
  ALL: "default",
  DESC_POSITION: "Vị trí giảm dần",
  ASC_POSITION: "Vị trí tăng dần",
  DESC_PRICE: "Giá giảm dần",
  ASC_PRICE: "Giá tăng dần",
};

const FilterBar = () => {
  // Tách state cho từng TextField
  const [filterAction, setFilterAction] = useState(FILTER_OPTIONS.ALL); // Cho TextField "Chọn hành động"
  const [filterStatus, setFilterStatus] = useState(OPTIONS.ALL); // Cho TextField "Tất cả"
  const [filterSort, setFilterSort] = useState(SORT_OPTIONS.ALL); // Cho TextField "Sắp xếp"

  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterActionChange = (event) => {
    setFilterAction(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterSortChange = (event) => {
    setFilterSort(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm, "với bộ lọc:", {
      filterAction,
      filterStatus,
      filterSort,
    });
  };

  const handleAddNew = () => {
    console.log('Nút "Thêm mới" được nhấn');
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2, boxSizing: "border-box" }}>
      <Grid container spacing={1} sx={{ height: "100%" }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            style={{
              padding: "8px 15px",
              display: "flex",
              height: "80%",
              marginLeft: 1,
              border: "solid 1px #ccc",
              minWidth: "auto",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            Thêm mới
          </Button>
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            placeholder="Nhập từ khóa"
            variant="outlined"
            size="small"
            sx={{
              width: 250,
              float: "right",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                  transition: "border-color 0.3s ease",
                },
              },
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item>
          <TextField
            select
            value={filterAction}
            onChange={handleFilterActionChange}
            variant="outlined"
            size="small"
            sx={{
              width: "11rem",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                  transition: "border-color 0.3s ease",
                },
              },
            }}
          >
            <MenuItem value={FILTER_OPTIONS.ALL} disabled>
              Chọn hành động
            </MenuItem>
            <MenuItem value={FILTER_OPTIONS.TATCA}>Hoạt động</MenuItem>
            <MenuItem value={FILTER_OPTIONS.ACTIVE}>Dừng hoạt động</MenuItem>
            <MenuItem value={FILTER_OPTIONS.DELETE_ALL}>Xóa tất cả</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            value={filterStatus}
            onChange={handleFilterStatusChange}
            variant="outlined"
            size="small"
            sx={{
              width: "9rem",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                  transition: "border-color 0.3s ease",
                },
              },
            }}
          >
            <MenuItem value={OPTIONS.ALL}>Tất cả</MenuItem>
            <MenuItem value={OPTIONS.POSITION1} style={{ color: "green" }}>
              Đang hoạt động
            </MenuItem>
            <MenuItem value={OPTIONS.POSITION2} style={{ color: "red" }}>
              Dừng hoạt động
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            value={filterSort}
            onChange={handleFilterSortChange}
            variant="outlined"
            size="small"
            sx={{
              width: "9rem",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                  transition: "border-color 0.3s ease",
                },
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
          </TextField>
        </Grid>
        <Grid className="botton_reset" item>
          <Button
            variant="text"
            onClick={handleSearch}
            style={{
              display: "flex",
              height: "80%",
              marginLeft: 1,
              backgroundColor: "transparent",
              border: "solid 1px #ccc",
              padding: "8px",
              minWidth: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CachedIcon className="icon_reset" />
          </Button>
        </Grid>
        <Grid className="botton_delete" item>
          <Button
            variant="text"
            onClick={handleSearch}
            style={{
              display: "flex",
              height: "80%",
              marginLeft: 1,
              border: "solid 1px #ccc",
              padding: "8px",
              minWidth: "auto",
              alignItems: "center",
              justifyContent: "center",
              position: "relative", // Để định vị số lượng sản phẩm
            }}
          >
            <DeleteIcon />
            <Box
              sx={{
                position: "absolute", // Định vị tuyệt đối
                top: 2, // Ở trên cùng
                right: 2, // Ở bên phải
                backgroundColor: "red", // Màu nền đỏ
                color: "white", // Màu chữ trắng
                borderRadius: "50%", // Hình tròn
                width: "20px", // Kích thước
                height: "20px", // Kích thước
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px", // Kích thước chữ
                transform: "translate(50%, -50%)",
                pointerEvents: "none",
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
