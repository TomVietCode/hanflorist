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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StoreInformation = () => {
  const [logo, setLogo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("0388882866");
  const [email, setEmail] = useState("mcuong04.work@gmail.com");
  const [address, setAddress] = useState(
    "Phenikaa University - Yên Nghĩa - Hà Đông - Hà Nội"
  );
  const [copyright, setCopyright] = useState("TomVietCode");

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Logic to save changes
    console.log("Thông tin đã được cập nhật");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
     
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Logo Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Logo
            </Typography>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                
                <Box
                  sx={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logo || "/default-logo.png"}
                    alt="Logo"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item>
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
                  >
                    Chọn tệp
                  </Button>
                </label>
              </Grid>
            </Grid>
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
            />
          </Grid>

          {/* Address Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Địa chỉ
            </Typography>
            <TextField
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="outlined"
            />
          </Grid>
          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleSave}>
                Cập nhật
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StoreInformation;