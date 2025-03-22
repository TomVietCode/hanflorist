import React, { useState } from "react";
import { Button } from "@mui/material";
import NotificationAndDialog, {
  showNotification,
  showConfirmDialog,
} from "./NotificationAndDialog";

const ProductManagement = () => {
  // State cho thông báo
  const [openNotification, setOpenNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State cho dialog xác nhận
  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  // Hàm giả lập tạo sản phẩm
  const handleCreateProduct = () => {
    // Giả lập thành công
    showNotification(setOpenNotification, "Tạo sản phẩm thành công", "success");

    // Giả lập thất bại
    // showNotification(setOpenNotification, "Tạo sản phẩm thất bại", "error");
  };

  // Hàm giả lập xóa sản phẩm
  const handleDeleteProduct = () => {
    showConfirmDialog(
      setDialogOpen,
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      () => {
        // Xử lý xóa thành công
        showNotification(setOpenNotification, "Xóa sản phẩm thành công", "success");
      },
      () => {
        // Hủy xóa
        showNotification(setOpenNotification, "Hủy xóa sản phẩm", "info");
      }
    );
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateProduct}
        sx={{ mr: 2 }}
      >
        Tạo sản phẩm
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteProduct}
      >
        Xóa sản phẩm
      </Button>

      {/* Component thông báo và dialog */}
      <NotificationAndDialog
        openNotification={openNotification.open}
        setOpenNotification={(value) =>
          setOpenNotification((prev) => ({ ...prev, open: value.open }))
        }
        notificationMessage={openNotification.message}
        notificationSeverity={openNotification.severity}
        dialogOpen={dialogOpen.open}
        setDialogOpen={(value) =>
          setDialogOpen((prev) => ({ ...prev, open: value.open }))
        }
        dialogTitle={dialogOpen.title}
        dialogMessage={dialogOpen.message}
        onConfirm={dialogOpen.onConfirm}
        onCancel={dialogOpen.onCancel}
      />
    </div>
  );
};

export default ProductManagement;