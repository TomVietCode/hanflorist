// src/components/Layout.js
import React from "react";
import Header from "./layout/Header";
import NavBar from "./layout/NavBar";
import Footer from "./layout/Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <NavBar />
      <main>{children}</main> {/* Nội dung của trang sẽ được render ở đây */}
      <Footer />
    </div>
  );
};

export default Layout;