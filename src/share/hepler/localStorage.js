// Hàm lấy giá trị từ localStorage
export const getLocalStorage = (key) => {
  return localStorage.getItem(key) || "";
};

// Hàm lưu giá trị vào localStorage
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

// Hàm xóa một giá trị trong localStorage
export const deleteLocalStorage = (key) => {
  localStorage.removeItem(key);
};

// Hàm xóa hết dữ liệu trong localStorage
export const deleteAllLocalStorage = () => {
  localStorage.clear();
};
