import React, { useState } from 'react';
import { Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

// Thông báo thành công
export const showSuccess = (message, setNotificationState) => {
  setNotificationState({
    open: true,
    severity: 'success',
    message,
  });
};

// Thông báo lỗi
export const showError = (message, setNotificationState) => {
  setNotificationState({
    open: true,
    severity: 'error',
    message,
  });
};

// Thông báo cảnh báo
export const showWarning = (message, setNotificationState) => {
  setNotificationState({
    open: true,
    severity: 'warning',
    message,
  });
};

// Thông báo thông tin
export const showInfo = (message, setNotificationState) => {
  setNotificationState({
    open: true,
    severity: 'info',
    message,
  });
};

// Hiển thị hộp thoại xác nhận
export const showConfirmDialog = (title, onConfirm, onCancel) => {
  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn thực hiện hành động này?
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const showSnackbar = (message, severity, setSnackbarState) => {
    setSnackbarState({
      open: true,
      message,
      severity
    });
  };
  
  export const Notification = ({ open, severity, message, onClose }) => (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

export default Notification;
