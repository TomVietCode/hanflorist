import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Breadcrumb } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import ReactPaginate from "react-paginate"; // For pagination
import Sidebar from "../../components/SideBar";
import "./CategoriesPages.css";
import { menuItems } from "../../components/layout/NavBar";
function CategoriesPages() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
  });
  const [sortOption, setSortOption] = useState("default"); // For sorting
  const [currentPage, setCurrentPage] = useState(0); // For pagination
  const [showSkeleton, setShowSkeleton] = useState(true); // For skeleton loading
  const productsPerPage = 16; // 4x4 grid

  // Function to find the main category (name) and subcategory (label) based on the category path
  const findCategoryLabels = (categoryPath) => {
    let mainLabel = "";
    let subLabel = "";
    let subPath = "";

    // Loop through menuItems to find the matching category
    for (const menuItem of menuItems) {
      const foundLink = menuItem.links.find(
        (link) => link.path === categoryPath
      );
      if (foundLink) {
        mainLabel = menuItem.name; // e.g., "BÓ HOA"
        subLabel = foundLink.label; // e.g., "Hoa Hồng"
        subPath = `/products/${foundLink.path}`; // e.g., "/products/hoa-hong"
        break;
      }
    }

    // Fallback if no match is found
    if (!mainLabel || !subLabel) {
      mainLabel = "Danh mục";
      subLabel = categoryPath.replace(/-/g, " ");
      subPath = `/products/${categoryPath}`;
    }

    return { mainLabel, subLabel, subPath };
  };

  const { mainLabel, subLabel, subPath } = findCategoryLabels(category);

  useEffect(() => {
    // Mock data (replace with API call in a real app)
    const mockProducts = [
      // Bó hoa
      { id: 1, image: "/img/hoa.png", title: "BÓ TULIP TRẮNG 20 BÔNG", price: "1.200.000 đ", priceValue: 1200000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 2, image: "https://via.placeholder.com/300x300", title: "URBAN GARDEN - Bó hoa mix...", price: "550.000 đ", priceValue: 550000, category: "Bó hoa", subCategory: "Bó hoa Size M", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 3, image: "https://via.placeholder.com/300x300", title: "BÓ TULIP XANH THAN MIX TRẮNG", price: "550.000 đ", priceValue: 550000, category: "Bó hoa", subCategory: "Bó hoa Size S", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 4, image: "https://via.placeholder.com/300x300", title: "BÓ CẨM TÚ CẦU XANH BLUE MIX", price: "750.000 đ", priceValue: 750000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 5, image: "https://via.placeholder.com/300x300", title: "BÓ HOA TONE ĐỎ HỒNG MIX TULIP", price: "1.200.000 đ", priceValue: 1200000, category: "Bó hoa", subCategory: "Hoa Hồng", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 8, image: "https://via.placeholder.com/300x300", title: "BÓ JULIET MIX TONE CAM - SIZE", price: "320.000 đ", priceValue: 320000, category: "Bó hoa", subCategory: "Hoa Ly", priceRange: "Dưới 500.000 đ" },
      { id: 11, image: "https://via.placeholder.com/300x300", title: "BÓ HOA TRUNG 1", price: "600.000 đ", priceValue: 600000, category: "Bó hoa", subCategory: "Bó hoa Size M", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 13, image: "https://via.placeholder.com/300x300", title: "BÓ MINI 1", price: "300.000 đ", priceValue: 300000, category: "Bó hoa", subCategory: "Bó hoa Size S", priceRange: "Dưới 500.000 đ" },
      { id: 21, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 2", price: "800.000 đ", priceValue: 800000, category: "Bó hoa", subCategory: "Hoa Hồng", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 22, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 3", price: "900.000 đ", priceValue: 900000, category: "Bó hoa", subCategory: "Hoa Ly", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 23, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 4", price: "1.000.000 đ", priceValue: 1000000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 24, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 5", price: "1.100.000 đ", priceValue: 1100000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 25, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 6", price: "1.300.000 đ", priceValue: 1300000, category: "Bó hoa", subCategory: "Hoa Hồng", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 26, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 7", price: "1.400.000 đ", priceValue: 1400000, category: "Bó hoa", subCategory: "Hoa Ly", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 27, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 8", price: "1.500.000 đ", priceValue: 1500000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 28, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 9", price: "1.600.000 đ", priceValue: 1600000, category: "Bó hoa", subCategory: "Bó hoa Size L", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 29, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 10", price: "1.700.000 đ", priceValue: 1700000, category: "Bó hoa", subCategory: "Hoa Hồng", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 30, image: "https://via.placeholder.com/300x300", title: "BÓ HOA 11", price: "1.800.000 đ", priceValue: 1800000, category: "Bó hoa", subCategory: "Hoa Ly", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Giỏ hoa
      { id: 6, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA MÂY - TONE NÂU CAFE", price: "950.000 đ", priceValue: 950000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 7, image: "https://via.placeholder.com/300x300", title: "PINK BLOSSOM BASKET - Giỏ hoa...", price: "1.200.000 đ", priceValue: 1200000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 9, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA NHỎ 1", price: "400.000 đ", priceValue: 400000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "Dưới 500.000 đ" },
      { id: 10, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA NHỎ 2", price: "450.000 đ", priceValue: 450000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "Dưới 500.000 đ" },
      { id: 31, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 3", price: "500.000 đ", priceValue: 500000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 32, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 4", price: "600.000 đ", priceValue: 600000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 33, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 5", price: "700.000 đ", priceValue: 700000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 34, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 6", price: "800.000 đ", priceValue: 800000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 35, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 7", price: "900.000 đ", priceValue: 900000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 36, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 8", price: "1.000.000 đ", priceValue: 1000000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 37, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 9", price: "1.100.000 đ", priceValue: 1100000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 38, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 10", price: "1.200.000 đ", priceValue: 1200000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 39, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 11", price: "1.300.000 đ", priceValue: 1300000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Tươi", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 40, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA 12", price: "1.400.000 đ", priceValue: 1400000, category: "Giỏ hoa", subCategory: "Giỏ Hoa Đẹp", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Hoa cưới
      { id: 12, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 1", price: "800.000 đ", priceValue: 800000, category: "Hoa cưới", subCategory: "Hoa Cưới", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 41, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 2", price: "900.000 đ", priceValue: 900000, category: "Hoa cưới", subCategory: "Hoa Cầm Tay", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 42, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 3", price: "1.000.000 đ", priceValue: 1000000, category: "Hoa cưới", subCategory: "Hoa Cưới", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 43, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 4", price: "1.100.000 đ", priceValue: 1100000, category: "Hoa cưới", subCategory: "Hoa Cầm Tay", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 44, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 5", price: "1.200.000 đ", priceValue: 1200000, category: "Hoa cưới", subCategory: "Hoa Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 45, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 6", price: "1.300.000 đ", priceValue: 1300000, category: "Hoa cưới", subCategory: "Hoa Cầm Tay", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 46, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 7", price: "1.400.000 đ", priceValue: 1400000, category: "Hoa cưới", subCategory: "Hoa Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 47, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 8", price: "1.500.000 đ", priceValue: 1500000, category: "Hoa cưới", subCategory: "Hoa Cầm Tay", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 48, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 9", price: "1.600.000 đ", priceValue: 1600000, category: "Hoa cưới", subCategory: "Hoa Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 49, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 10", price: "1.700.000 đ", priceValue: 1700000, category: "Hoa cưới", subCategory: "Hoa Cầm Tay", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Combo cưới
      { id: 14, image: "/img/hoa.png", title: "COMBO CƯỚI 1", price: "1.000.000 đ", priceValue: 1000000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 50, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 2", price: "1.100.000 đ", priceValue: 1100000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 51, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 3", price: "1.200.000 đ", priceValue: 1200000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 52, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 4", price: "1.300.000 đ", priceValue: 1300000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 53, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 5", price: "1.400.000 đ", priceValue: 1400000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 54, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 6", price: "1.500.000 đ", priceValue: 1500000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 55, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 7", price: "1.600.000 đ", priceValue: 1600000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 56, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 8", price: "1.700.000 đ", priceValue: 1700000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 57, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 9", price: "1.800.000 đ", priceValue: 1800000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 58, image: "https://via.placeholder.com/300x300", title: "COMBO CƯỚI 10", price: "1.900.000 đ", priceValue: 1900000, category: "Combo cưới", subCategory: "Combo Cưới", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Hộp hoa
      { id: 15, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 1", price: "600.000 đ", priceValue: 600000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 59, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 2", price: "700.000 đ", priceValue: 700000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 60, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 3", price: "800.000 đ", priceValue: 800000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 61, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 4", price: "900.000 đ", priceValue: 900000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 62, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 5", price: "1.000.000 đ", priceValue: 1000000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 63, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 6", price: "1.100.000 đ", priceValue: 1100000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 64, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 7", price: "1.200.000 đ", priceValue: 1200000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 65, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 8", price: "1.300.000 đ", priceValue: 1300000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 66, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 9", price: "1.400.000 đ", priceValue: 1400000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 67, image: "https://via.placeholder.com/300x300", title: "HỘP HOA 10", price: "1.500.000 đ", priceValue: 1500000, category: "Hộp hoa", subCategory: "Hộp Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Lẵng hoa
      { id: 16, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 1", price: "700.000 đ", priceValue: 700000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 68, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 2", price: "800.000 đ", priceValue: 800000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 69, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 3", price: "900.000 đ", priceValue: 900000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 70, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 4", price: "1.000.000 đ", priceValue: 1000000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 71, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 5", price: "1.100.000 đ", priceValue: 1100000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 72, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 6", price: "1.200.000 đ", priceValue: 1200000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 73, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 7", price: "1.300.000 đ", priceValue: 1300000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 74, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 8", price: "1.400.000 đ", priceValue: 1400000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 75, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 9", price: "1.500.000 đ", priceValue: 1500000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 76, image: "https://via.placeholder.com/300x300", title: "LẴNG HOA 10", price: "1.600.000 đ", priceValue: 1600000, category: "Lẵng hoa", subCategory: "Lẵng Hoa", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Hoa lan
      { id: 17, image: "https://via.placeholder.com/300x300", title: "HOA LAN 1", price: "900.000 đ", priceValue: 900000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 77, image: "https://via.placeholder.com/300x300", title: "HOA LAN 2", price: "1.000.000 đ", priceValue: 1000000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 78, image: "https://via.placeholder.com/300x300", title: "HOA LAN 3", price: "1.100.000 đ", priceValue: 1100000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 79, image: "https://via.placeholder.com/300x300", title: "HOA LAN 4", price: "1.200.000 đ", priceValue: 1200000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 80, image: "https://via.placeholder.com/300x300", title: "HOA LAN 5", price: "1.300.000 đ", priceValue: 1300000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 81, image: "https://via.placeholder.com/300x300", title: "HOA LAN 6", price: "1.400.000 đ", priceValue: 1400000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 82, image: "https://via.placeholder.com/300x300", title: "HOA LAN 7", price: "1.500.000 đ", priceValue: 1500000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 83, image: "https://via.placeholder.com/300x300", title: "HOA LAN 8", price: "1.600.000 đ", priceValue: 1600000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 84, image: "https://via.placeholder.com/300x300", title: "HOA LAN 9", price: "1.700.000 đ", priceValue: 1700000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 85, image: "https://via.placeholder.com/300x300", title: "HOA LAN 10", price: "1.800.000 đ", priceValue: 1800000, category: "Hoa lan", subCategory: "Hoa Lan", priceRange: "1.000.000 đ - 2.000.000 đ" },
      // Hoa hướng dương
      { id: 18, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 1", price: "500.000 đ", priceValue: 500000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 86, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 2", price: "600.000 đ", priceValue: 600000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 87, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 3", price: "700.000 đ", priceValue: 700000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 88, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 4", price: "800.000 đ", priceValue: 800000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 89, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 5", price: "900.000 đ", priceValue: 900000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 90, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 6", price: "1.000.000 đ", priceValue: 1000000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "500.000 đ - 1.000.000 đ" },
      { id: 91, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 7", price: "1.100.000 đ", priceValue: 1100000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 92, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 8", price: "1.200.000 đ", priceValue: 1200000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 93, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 9", price: "1.300.000 đ", priceValue: 1300000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "1.000.000 đ - 2.000.000 đ" },
      { id: 94, image: "https://via.placeholder.com/300x300", title: "HOA HƯỚNG DƯƠNG 10", price: "1.400.000 đ", priceValue: 1400000, category: "Hoa hướng dương", subCategory: "Hoa Hướng Dương", priceRange: "1.000.000 đ - 2.000.000 đ" },
    ];

    // Filter products by the selected category from the URL
    const filteredByCategory = mockProducts.filter(
      (product) => product.subCategory.toLowerCase() === category.replace("-", " ")
    );

    setProducts(filteredByCategory);
    setFilteredProducts(filteredByCategory);

    // Show skeleton for 0.5 seconds after the global 1-second loading
    setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
  }, [category]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterType === "category") {
        if (updatedFilters.categories.includes(value)) {
          updatedFilters.categories = updatedFilters.categories.filter(
            (cat) => cat !== value
          );
        } else {
          updatedFilters.categories.push(value);
        }
      } else if (filterType === "price") {
        if (updatedFilters.priceRanges.includes(value)) {
          updatedFilters.priceRanges = updatedFilters.priceRanges.filter(
            (range) => range !== value
          );
        } else {
          updatedFilters.priceRanges.push(value);
        }
      }
      return updatedFilters;
    });

    // Apply filters
    let filtered = [...products];
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.subCategory)
      );
    }
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((product) =>
        filters.priceRanges.includes(product.priceRange)
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Sorting logic
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedProducts = [...filteredProducts];
    if (option === "price-asc") {
      sortedProducts.sort((a, b) => a.priceValue - b.priceValue);
    } else if (option === "price-desc") {
      sortedProducts.sort((a, b) => b.priceValue - a.priceValue);
    } else if (option === "name-asc") {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "name-desc") {
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    }
    setFilteredProducts(sortedProducts);
    setCurrentPage(0); // Reset to first page when sorting changes
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  return (
    <div className="categories-page-wrapper">
      {/* Banner Section */}
      <div className="category-banner">
        <h1 className="banner-title">
          {mainLabel} -{" "}
          <Link to={subPath} className="banner-subcategory">
            {subLabel}
          </Link>
        </h1>
      </div>

      <Container className="categories-page py-5">
        <Row>
          <Col md={3}>
            <Sidebar onFilterChange={handleFilterChange} />
          </Col>
          <Col md={9}>
            {/* Breadcrumbs */}
            <Breadcrumb className="category-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                {mainLabel} - {subLabel}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className="products-header d-flex justify-content-end align-items-center mb-4">
              <div className="products-meta">
                <span>{filteredProducts.length} Items On List</span>
                <Form.Select
                  className="sort-select ms-3"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Sort By: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </Form.Select>
              </div>
            </div>
            <Row>
              {showSkeleton
                ? Array.from({ length: productsPerPage }).map((_, index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <div className="product-card-skeleton">
                        <div className="product-image-skeleton"></div>
                        <div className="product-title-skeleton"></div>
                        <div className="product-price-skeleton"></div>
                      </div>
                    </Col>
                  ))
                : currentProducts.map((product) => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <ProductCard product={product} />
                    </Col>
                  ))}
            </Row>
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CategoriesPages;