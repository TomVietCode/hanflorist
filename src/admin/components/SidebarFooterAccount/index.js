import * as React from "react";
import PropTypes from "prop-types";
import { Account, AccountPreview } from "@toolpad/core/Account";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { SignOutButton } from "@toolpad/core/Account";
import { useNavigate } from "react-router-dom"; // Thêm hook để chuyển hướng

// Tạo component PreviewComponent
const createPreviewComponent = (mini) => {
  return function PreviewComponent(props) {
    return <AccountPreview {...props} variant={mini ? "condensed" : "expanded"} />;
  };
};

// Component SidebarFooterAccountPopover
const SidebarFooterAccountPopover = () => {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const handleProfileClick = () => {
    navigate("/profile"); // Chuyển hướng đến trang thông tin tài khoản
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password"); // Chuyển hướng đến trang đổi mật khẩu
  };

  return (
    <Stack direction="column">
      <MenuList>
        <MenuItem onClick={handleProfileClick}>
          Thông tin tài khoản
        </MenuItem>
        <MenuItem onClick={handleChangePasswordClick}>
          Đổi mật khẩu
        </MenuItem>
        <Divider />
        <MenuItem>
          <SignOutButton />
        </MenuItem>
      </MenuList>
    </Stack>
  );
};

// Component SidebarFooterAccount
const SidebarFooterAccount = ({ mini }) => {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent, // Sử dụng PreviewComponent đã tạo
        popoverContent: SidebarFooterAccountPopover, // Sử dụng SidebarFooterAccountPopover cho popover
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${
                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"
                  })`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
};

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired, // Prop mini để xác định chế độ thu gọn hay mở rộng
};

export default SidebarFooterAccount;
