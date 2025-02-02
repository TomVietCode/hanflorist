import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { NAVIGATION } from "./Navigation";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
// theme.js (hoặc bất kỳ tên nào bạn chọn)
import { createTheme } from '@mui/material/styles';
import SidebarFooterAccount from "./SidebarFooterAccount";
import BC from "../components/breadcrumb/index"; 
import "./style.css"



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
        logo: <img src={logo} alt="Logo" style={{ width: "100%" }} className="Logo"/>,
        title: (
          <span
            style={{
              background: "linear-gradient(45deg,rgb(107, 134, 255),rgb(17, 50, 86))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontSize: "20px",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            Trang Quản Trị ✨
          </span>
        ),
        homeUrl: "/admin/dashboard",
      }}
      
      theme={theme}
      window={demoWindow}
    >
      <DashboardLayout
        sidebarExpandedWidth={240}
      >
        <SidebarFooterAccount mini={false} />
        <PageContainer
          style={{
            maxWidth: 16000,
            transition: 'margin-left 0.3s ease-in-out',
            willChange: "margin-left",
            
          }} 
        >
          <BC/>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
