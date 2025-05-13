import * as React from "react";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "./shared-theme/AppTheme";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.svg";
import { postPublic } from "../../../../share/utils/http";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(100px)",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "linear-gradient(to right, hsl(210, 70.10%, 82.90%), hsl(0, 0.00%, 100.00%))",
    backgroundRepeat: "no-repeat",
  },
}));
export default function SignUp(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = (email, password) => {
    let isValid = true;

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Mật khẩu phải ít nhất 6 kí tự.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!validateInputs(email, password)) {
      setLoading(false);
      return;
    }

    const userData = { username: email, password };

    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }

    try {
      const result = await postPublic("/admin/auth/login", userData);
      
      if (result.data) {
        localStorage.setItem("token", result.data);
        localStorage.setItem("loginSuccess", "true");
        navigate("/admin");
      } else {
        setSubmitError(result.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      setSubmitError("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img src={logo} alt="Logo" />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                  },
                }}
              />
            </FormControl>
            {submitError && (
              <Typography color="error" variant="body2" align="center">
                {submitError}
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="allowExtraEmails"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Ghi nhớ tài khoản"
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  ""
                )
              }
              sx={{
                px: 4,
                py: 1,
                fontSize: "16px",
                borderRadius: "8px",
                textTransform: "none",
                transition: "0.3s",
                backgroundColor: "#1565c0",
                color: loading ? "white" : "white",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
