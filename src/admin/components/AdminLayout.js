import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { NAVIGATION } from "./Navigation";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import flower from "../assets/flower.svg";
import { createTheme } from "@mui/material/styles";
import { useAuth } from "../AuthContext"; // Thay bằng đường dẫn thực tế
import SidebarFooterAccount from "./SidebarFooterAccount";
import BC from "../components/breadcrumb/index";
import "./style.css";

export default function AdminLayout(props) {
  const { user, loading } = useAuth();
  console.log(user)
  const theme = createTheme({
    palette: {
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      background: { default: "#f4f6f8", paper: "#ffffff" },
      text: { primary: "#333", secondary: "#666" },
    },
    typography: { fontFamily: "Roboto, sans-serif" },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: { root: { borderRadius: 12, textTransform: "none" } },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 8, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" },
        },
      },
    },
  });

  const { window } = props;
  const demoWindow = window?.() || undefined;
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AppProvider
      navigation={NAVIGATION.filter((item) => !item.hidden)}
      branding={{
        logo: (
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100%", maxWidth: 200, padding: "8px" }}
            className="Logo"
          />
        ),
        title: (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
              fontSize: "1.3rem",
              fontWeight: "bold",
              background:
                "linear-gradient(45deg, rgb(51, 86, 241), rgb(239, 140, 226))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            Trang Quản Trị HanFlorist
            <span
              className="flower"
              style={{
                marginLeft: "2px",
                transform: "rotate(-15deg)",
                opacity: 0.9,
              }}
            >
              <img
                src={flower}
                alt="flower"
                style={{ height: "1rem", width: "auto" }}
              />
            </span>
          </span>
        ),
        homeUrl: "/admin/dashboard",
      }}
      theme={theme}
      window={demoWindow}
    >
      <DashboardLayout
        sidebarExpandedWidth={280}
        sidebarCollapsedWidth={80}
        slots={{
          sidebarFooter: SidebarFooterAccount, // Truyền component, không gọi hàm
        }}
        slotProps={{
          sidebarFooter: { user: user }, // Truyền data như prop 'user'
        }}
      >
        <PageContainer
          style={{
            maxWidth: 1600,
            padding: "16px",
            margin: "0 auto",
            transition: "margin-left 0.3s ease-in-out",
            willChange: "margin-left",
          }}
        >
          <BC />
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
