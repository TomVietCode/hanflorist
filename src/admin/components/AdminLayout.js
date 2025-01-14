import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { NAVIGATION } from "./Navigation";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
// theme.js (hoặc bất kỳ tên nào bạn chọn)
import { createTheme } from '@mui/material/styles';





export default function AdminLayout(props) {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Màu chính
      },
      secondary: {
        main: '#dc004e', // Màu phụ
      },
      background: {
        default: '#f4f6f8', // Màu nền
        paper: '#ffffff',
      },
      text: {
        primary: '#333',
        secondary: '#666',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
  const { window } = props;

  const demoWindow = window?.() || undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={logo} alt="Logo" style={{ width: "100%" }} />,
        title: "",
        homeUrl: "/admin/dashboard",
      }}
      theme={theme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
