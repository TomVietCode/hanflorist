import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Routes, Route, useLocation } from "react-router-dom";
import { NAVIGATION } from "../Navigation"; // Import NAVIGATION

function DemoPageContent() {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <Box
      sx={{
        py: 15,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAFBFD",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <Typography>
        <Routes location={location}>
          {NAVIGATION.map((item) => (
            <Route
              key={item.segment}
              path={`/${item.segment}`} 
              element={<item.component />}
            />
          ))}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string,
};

export default DemoPageContent;
