import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./SideBar.css";

function Sidebar({ onFilterChange, onClearFilters }) {
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    priceRanges: [],
  });

  const priceRanges = [
    "Dưới 500.000 đ",
    "500.000 đ - 1.000.000 đ",
    "1.000.000 đ - 2.000.000 đ",
    "Trên 2.000.000 đ",
  ];

  const handleTempFilterChange = (filterType, value) => {
    setTempFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterType === "price") {
        if (updatedFilters.priceRanges.includes(value)) {
          updatedFilters.priceRanges = updatedFilters.priceRanges.filter(
            (range) => range !== value
          );
        } else {
          updatedFilters.priceRanges.push(value);
        }
      } else if (filterType === "category") {
        if (updatedFilters.categories.includes(value)) {
          updatedFilters.categories = updatedFilters.categories.filter(
            (cat) => cat !== value
          );
        } else {
          updatedFilters.categories.push(value);
        }
      }

      return updatedFilters;
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters({
      categories: [],
      priceRanges: [],
    });
    onClearFilters();
  };

  return (
    <div className="sidebar">
      <h5 className="sidebar-title">Lọc Theo Giá</h5>
      <div className="sidebar-filters">
        {priceRanges.map((range, index) => (
          <Form.Check
            key={index}
            type="checkbox"
            label={range}
            checked={tempFilters.priceRanges.includes(range)}
            onChange={() => handleTempFilterChange("price", range)}
            className="sidebar-filter-checkbox"
          />
        ))}
      </div>
      <div className="sidebar-actions">
        <button className="apply-filter-button" onClick={handleApplyFilters}>
          Lọc
        </button>
        <button className="clear-filter-button" onClick={handleClearFilters}>
          Xóa
        </button>
      </div>
    </div>
  );
}

export default Sidebar;