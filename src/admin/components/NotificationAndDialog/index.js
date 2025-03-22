import React, { useState } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

// Component chính
const NotificationAndDialog = ({
  openNotification,
  setOpenNotification,
  notificationMessage,
  notificationSeverity,
  dialogOpen,
  setDialogOpen,
  dialogTitle,
  dialogMessage,
  onConfirm,
  onCancel,
}) => {
  // Xử lý đóng thông báo (Snackbar)
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenNotification(false);
  };

  // Xử lý khi người dùng nhấn Yes trong dialog
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setDialogOpen(false);
  };

  // Xử lý khi người dùng nhấn No trong dialog
  const handleCancel = () => {
    if (onCancel) onCancel();
    setDialogOpen(false);
  };

  return (
    <>
      {/* Snackbar để hiển thị thông báo */}
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationSeverity}
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>

      {/* Dialog để xác nhận Yes/No */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Hàm tiện ích để hiển thị thông báo
export const showNotification = (
  setOpenNotification,
  message,
  severity = "success"
) => {
  setOpenNotification({ open: true, message, severity });
};

// Hàm tiện ích để mở dialog xác nhận
export const showConfirmDialog = (
  setDialogOpen,
  title,
  message,
  onConfirm,
  onCancel
) => {
  setDialogOpen({ open: true, title, message, onConfirm, onCancel });
};

export default NotificationAndDialog;