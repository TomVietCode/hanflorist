import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/ErrorOutline"; // Error icon
import { keyframes } from "@mui/system"; // For animations

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Navigate to the previous page
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Animation for the error icon (pulsing effect)
  const pulse = keyframes`
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `;

  // Animation for the 404 text (fade-in and bounce)
  const bounce = keyframes`
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    60% {
      transform: translateY(10px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  `;

  // Animation for the button (hover scaling)
  const hoverScale = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  `;

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          textAlign: "center",
          borderRadius: 2,
          maxWidth: 600,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent white
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Error icon with pulsing animation */}
          <ErrorIcon
            sx={{
              fontSize: 80,
              color: "#FF6B6B", // Pink color from the flower emoji
              animation: `${pulse} 2s infinite`,
            }}
          />

          {/* 404 text with bounce animation */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: "6rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #3B82F6, #D946EF)", // Gradient text
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              animation: `${bounce} 1s ease-in-out`,
            }}
          >
            404
          </Typography>

          {/* Error description */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            Oops! Trang bạn tìm kiếm không tồn tại.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
            }}
          >
            Có vẻ như trang bạn đang tìm đã bị xóa, đổi tên hoặc không tồn tại. Hãy thử quay lại trang trước đó hoặc liên hệ với quản trị viên nếu cần hỗ trợ.
          </Typography>

          {/* Button with hover animation */}
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #3B82F6, #D946EF)", // Gradient button
              color: "#fff",
              size: "large",
              textTransform: "none",
              padding: "8px 24px",
              borderRadius: 2,
              "&:hover": {
                
                animation: `${hoverScale} 0.3s ease-in-out`,
              },
            }}
            onClick={handleGoBack}
          >
            Quay lại trang trước
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;