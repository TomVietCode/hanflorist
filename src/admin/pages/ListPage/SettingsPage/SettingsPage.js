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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./style.css"
import Logo from "../../../assets/logo.svg";

const StoreInformation = () => {
  const [logo, setLogo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("0388882866");
  const [email, setEmail] = useState("mcuong04.work@gmail.com");
  const [address, setAddress] = useState(
    "Phenikaa University - Yên Nghĩa - Hà Đông - Hà Nội"
  );

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Thông tin đã được cập nhật");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#1976d2" }}>
          Thông Tin Cửa Hàng
        </Typography>

        <Grid container spacing={3}>
          {/* Logo Section */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Logo cửa hàng
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={logo || Logo}
                alt="Logo"
                sx={{ width: "auto", height: 150, borderRadius: "8px", boxShadow: 3 }}
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

          {/* Phone Number Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
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

          {/* Email Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
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

          {/* Address Section */}
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

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
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
                Cập nhật thông tin
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StoreInformation;
