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
import AddIcon from "@mui/icons-material/Add";
import { useSearchStore, useStatusStore } from "../../../components/store";
import "./style.css";

// Định nghĩa các hằng số cho giá trị value
const OPTIONS = {
  ALL: "Tất cả",
  POSITION1: "Đang hoạt động",
  POSITION2: "Dừng hoạt động",
};

const FilterBar = () => {
  const [filterStatus, setFilterStatus] = useState(OPTIONS.ALL); // Cho TextField "Tất cả"
  const navigate = useNavigate();

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const [searchTermLocal, setSearchTermLocal] = useState("");
  const { setSearchTerm } = useSearchStore(); // Lấy setter từ Zustand
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTermLocal(value); // Cập nhật UI
    setSearchTerm(value); // Cập nhật Zustand store
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2, boxSizing: "border-box" }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ height: "100%" }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/categories/add-categories")}
            sx={{
              height: "2.6rem",
              px: 2,
              fontSize: "18px",
              backgroundColor: "#1976d2", // Xanh dương
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#1565c0", // Tối hơn khi hover
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease",
              },
              "&:active": {
                backgroundColor: "#0d47a1", // Đậm hơn khi nhấn
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
            value={searchTermLocal}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <Select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              variant="outlined"
              size="small"
              sx={{
                height: "2.5rem",
                width: "9rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem className="status-indicator-add" value={OPTIONS.ALL}>
                Tất cả
              </MenuItem>
              <MenuItem
                className="status-indicator-add active"
                value={OPTIONS.POSITION1}
                sx={{ color: "green" }}
              >
                Đang hoạt động
              </MenuItem>
              <MenuItem
                className="status-indicator-add inactive"
                value={OPTIONS.POSITION2}
                sx={{ color: "red" }}
              >
                Dừng hoạt động
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;
