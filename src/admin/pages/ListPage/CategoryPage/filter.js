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
import { useSearchStore, useStatusStore } from "../ProductListPage/store";
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
      <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{ height: "100%" }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/categories/add-categories")}
            style={{
              padding: "8px 15px",
              display: "flex",
              height: "90%",
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
              <MenuItem className="status-indicator-add"  value={OPTIONS.ALL}>Tất cả</MenuItem>
              <MenuItem className="status-indicator-add active" value={OPTIONS.POSITION1} sx={{ color: "green" }}>
                Đang hoạt động
              </MenuItem>
              <MenuItem className="status-indicator-add inactive"  value={OPTIONS.POSITION2} sx={{ color: "red" }}>
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
