import React from "react";
import "./SideBar.css";

function Sidebar({ onFilterChange }) {
  const priceRanges = [
    "Dưới 500.000 đ",
    "500.000 đ - 1.000.000 đ",
    "1.000.000 đ - 2.000.000 đ",
    "Trên 2.000.000 đ",
  ];

  return (
    <div className="sidebar">
      <h3>Giá</h3>
      <ul className="price-list">
        {priceRanges.map((range) => (
          <li key={range}>
            <label>
              <input
                type="checkbox"
                onChange={() => onFilterChange("price", range)}
              />
              {range}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;