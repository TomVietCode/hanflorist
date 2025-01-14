import * as React from "react";
import PropTypes from "prop-types";
import { Account, AccountPreview } from "@toolpad/core/Account";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack"; // Đảm bảo rằng Stack được import từ MUI
import { SignOutButton } from "@toolpad/core/Account"; // Đảm bảo import đúng SignOutButton

// Tạo component PreviewComponent
const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountPreview {...props} variant={mini ? "condensed" : "expanded"} />;
  }
  return PreviewComponent;
};

// SidebarFooterAccount nhận prop mini để xác định chế độ mini hay expanded
function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent, // Sử dụng PreviewComponent đã tạo ở trên
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
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
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
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired, // Tham số mini để xác định dạng thu gọn hay mở rộng
};

// SidebarFooterAccountPopover function được gộp vào trong SidebarFooterAccount
function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <MenuList>
        <MenuItem
          variant="body2"
          mx={2}
          mt={1}
          onClick={() => {
            alert("Chuyển hướng đến trang đổi mật khẩu");
          }}
        >
          Thông tin tài khoản
        </MenuItem>
        <MenuItem>Đổi mật khẩu</MenuItem>

        <Divider />

        <MenuItem>
          <SignOutButton />
        </MenuItem>
      </MenuList>
    </Stack>
  );
}

export default SidebarFooterAccount;
