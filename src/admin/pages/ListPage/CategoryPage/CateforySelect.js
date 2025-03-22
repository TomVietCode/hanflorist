import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { get } from "../../../../share/utils/http.js";
import { useCategoryStore } from "../../../components/store.js";

const CategorySelect = ({ isForProduct = true }) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `/admin/categories`;
        const result = await get(token, url);
        const activeCategories = (result.data || []).filter(
          (category) => category.status === "active"
        );
        setCategories(activeCategories);

        // Nếu selectedCategory không còn active, reset nó
        if (selectedCategory && selectedCategory.status !== "active") {
          setSelectedCategory(null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token, selectedCategory, setSelectedCategory]);

  const handleSelectCategory = (category) => {
    if (
      (!category.children || category.children.length === 0) &&
      category.status === "active"
    ) {
      setSelectedCategory(category);
      setOpen(false);
    }
  };

  const flattenCategories = (cats, depth = 0) => {
    let flat = [];
    cats.forEach((cat) => {
      if (cat.status === "active") { // Chỉ thêm nếu active
        flat.push({ ...cat, depth, isParent: !cat.parentId });
        if (cat.children && cat.children.length > 0) {
          flat = flat.concat(flattenCategories(cat.children, depth + 1));
        }
      }
    });
    return flat;
  };

  const renderCategories = () => {
    const flatCategories = flattenCategories(categories);
    if (flatCategories.length === 0) {
      return (
        <MenuItem disabled>
          <Typography variant="body2">Không có danh mục active</Typography>
        </MenuItem>
      );
    }

    return flatCategories.map((category) => {
      const isSelected = selectedCategory?._id === category._id;
      const isParent = category.isParent;
      const hasChildren = category.children && category.children.length > 0;

      return (
        <MenuItem
          key={category._id}
          value={category._id}
          disabled={hasChildren}
          sx={{
            pl: 2 + category.depth * 2,
            fontWeight: isParent ? "bold" : "normal",
            backgroundColor: isSelected
              ? "#e3f2fd"
              : isParent
              ? "#f0f4f8"
              : "#fafafa",
            "&:hover": {
              backgroundColor: isParent ? "#e8eef4" : "#e0f7fa",
            },
            borderBottom: "1px solid #e0e0e0",
            "&.Mui-disabled": {
              opacity: 0.6,
              cursor: "not-allowed",
              backgroundColor: "#f0f4f8",
            },
            transition: "background-color 0.2s ease",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectCategory(category);
          }}
        >
          <Typography
            variant="body2"
            sx={{ flexGrow: 1, whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {category.title}
          </Typography>
        </MenuItem>
      );
    });
  };

  return (
    <Grid>
      <Typography variant="h6" gutterBottom>
        Danh mục sản phẩm
      </Typography>
      <FormControl fullWidth>
        <Select
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          value={selectedCategory?._id || ""}
          displayEmpty
          renderValue={() =>
            categories.length === 0
              ? "Chưa có danh mục active"
              : selectedCategory
              ? selectedCategory.title
              : "Chưa chọn danh mục"
          }
          sx={{
            borderRadius: 1,
            height: "2.5rem",
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
          }}
          MenuProps={{
            autoFocus: false,
            PaperProps: {
              sx: {
                maxHeight: "300px",
                overflowY: "auto",
                width: "300px",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          }}
        >
          {renderCategories()}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default CategorySelect;