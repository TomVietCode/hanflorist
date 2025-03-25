import * as React from "react";
import { Avatar, Typography, Box } from "@mui/material";

const SidebarFooterAccount = ({ user }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {user ? (
        <>
          <Avatar
            src={user.thumbnail} // Đảm bảo field là thumbnail, không phải thumail
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
        </>
      ) : (
        <Typography variant="body2">Chưa đăng nhập</Typography>
      )}
    </Box>
  );
};

export default SidebarFooterAccount;