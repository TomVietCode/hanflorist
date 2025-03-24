import React from "react";
import "./loading.css"; // Nếu bạn muốn thêm CSS

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Đang tải...</p>
    </div>
  );
};

export default Loading; 