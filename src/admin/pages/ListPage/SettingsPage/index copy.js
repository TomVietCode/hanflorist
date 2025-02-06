import React, { useState } from "react";
import { Container, Typography, TextField, Button, Switch, FormControlLabel, Grid, Paper } from "@mui/material";

const AdminSettings = () => {
  const [storeName, setStoreName] = useState("HF Han Florist");
  const [email, setEmail] = useState("contact@hfhanflorist.com");
  const [phone, setPhone] = useState("+84 123 456 789");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("vi");

  const handleSave = () => {
    console.log({ storeName, email, phone, darkMode, language });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Cài đặt chung
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Tên cửa hàng" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email liên hệ" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
              label="Chế độ tối"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Ngôn ngữ" value={language} onChange={(e) => setLanguage(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Lưu cài đặt
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminSettings;
