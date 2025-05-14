import * as React from "react";
import { Avatar, Typography, Box, Button, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const SidebarFooterAccount = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/auth/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderTop: "1px solid #e0e0e0",
        justifyContent: "space-between",
      }}
    >
      {user ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 40, height: 40, marginRight: "12px" }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Đăng xuất">
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: "#666",
                "&:hover": {
                  color: "#f44336"
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Typography variant="body2">Chưa đăng nhập</Typography>
      )}
    </Box>
  );
};

export default SidebarFooterAccount;