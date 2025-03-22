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
import CachedIcon from "@mui/icons-material/Cached";
import {
  useSearchStore,
  useResetStore,
  useSortStore,
} from "../../../../components/store";
import "./style.css";

// Define filter options constants
const SORT_OPTIONS = {
  ALL: "default",
  NEWEST: "Mới nhất",
  OLDEST: "Cũ nhất",
};

const FilterBar = () => {
  const navigate = useNavigate();

  // Search state
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const { setSearchTerm } = useSearchStore();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTermLocal(value); // Cập nhật UI
    setSearchTerm(value); // Cập nhật Zustand store
  };

  // Sort state
  const [filterSort, setFilterSortLocal] = useState(SORT_OPTIONS.ALL);
  const { sortTerm, setSortTerm } = useSortStore();

  const handleSortChange = (event) => {
    const value = event.target.value;
    setFilterSortLocal(value); // Cập nhật UI
    setSortTerm(value); // Cập nhật Zustand store
  };

  // Reset state
  const { isActive, toggleActive } = useResetStore();

  const handleReset = useCallback(() => {
    setSearchTermLocal(""); // Reset search UI
    setSearchTerm(""); // Reset search store
    setFilterSortLocal(SORT_OPTIONS.ALL); // Reset sort UI
    setSortTerm(""); // Reset sort store
    toggleActive(false); // Reset trạng thái
  }, [setSearchTerm, setSortTerm, toggleActive]);

  useEffect(() => {
    if (isActive) {
      handleReset();
    }
  }, [isActive, handleReset]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Input */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            placeholder="Nhập từ khóa"
            variant="outlined"
            size="small"
            value={searchTermLocal}
            onChange={handleSearch}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
        </Grid>

        {/* Sort Filter */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl size="small" fullWidth>
            <Select
              value={filterSort}
              onChange={handleSortChange}
              displayEmpty
              sx={{
                height: "2.8rem",
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
              <MenuItem value={SORT_OPTIONS.NEWEST}>Mới nhất</MenuItem>
              <MenuItem value={SORT_OPTIONS.OLDEST}>Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
        <Grid item >
          <Button
            variant="outlined"
            onClick={handleReset}
            fullWidth
            sx={{
              height: "2.8rem",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          >
            <CachedIcon />
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
};

export default FilterBar;