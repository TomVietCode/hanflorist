import * as React from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { AccountPreview } from "@toolpad/core/Account";

function SidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0} overflow="hidden">
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
        sx={{
          width: "100%",
          padding: "8px",
        }}
      />
    </Stack>
  );
}

SidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

export default SidebarPreview;