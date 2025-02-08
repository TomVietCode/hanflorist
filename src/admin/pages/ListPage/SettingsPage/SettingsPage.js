import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Input,
  Box,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import "./style.css";
import Logo from "../../../assets/logo.svg";

const StoreInformation = () => {
  const [logo, setLogo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("0388882866");
  const [email, setEmail] = useState("mcuong04.work@gmail.com");
  const [address, setAddress] = useState(
    "Phenikaa University - Yên Nghĩa - Hà Đông - Hà Nội"
  );
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage("Thông tin đã được cập nhật thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
        <Grid container spacing={3}>
          {/* Logo Section */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>
              Logo cửa hàng
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={logo || Logo}
                alt="Logo"
                sx={{
                  width: "auto",
                  height: 200,
                  borderRadius: "8px",
                  boxShadow: 3,
                }}
              />
              <Input
                accept="image/*"
                style={{ display: "none" }}
                id="logo-upload"
                type="file"
                onChange={handleLogoChange}
              />
              <label htmlFor="logo-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2 }}
                >
                  Tải ảnh lên
                </Button>
              </label>
            </Box>
          </Grid>

          {/* Phone Number, Email, Address Section */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Số điện thoại
                </Typography>
                <TextField
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: {
                      height: "2.5rem",
                    },
                  }}
                  sx={{
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                        transition: "border-color 0.3s ease",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: {
                      height: "2.5rem",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                        transition: "border-color 0.3s ease",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Địa chỉ cửa hàng
                </Typography>
                <TextField
                  fullWidth
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{
                    style: {
                      height: "3rem",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                        transition: "border-color 0.3s ease",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1,
                  fontSize: "16px",
                  borderRadius: "8px",
                  textTransform: "none",
                  transition: "0.3s",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                {loading ? "Đang lưu..." : "Lưu thông tin"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StoreInformation;