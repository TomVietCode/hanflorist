import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Breadcrumb } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import ReactPaginate from "react-paginate";
import Sidebar from "../../components/SideBar";
import "./CategoriesPages.css";
import { menuItems } from "../../components/layout/NavBar";

function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function CategoriesPages() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
  });
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const productsPerPage = 16; // 4x4 grid

  // Mock data (dùng làm fallback nếu API thất bại)
  const mockProducts = [
    // Bó hoa - Hoa Hồng (bổ sung để vượt 16 sản phẩm)
    {
      id: 5,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA TONE ĐỎ HỒNG MIX TULIP",
      price: "1.200.000 đ",
      priceValue: 1200000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 21,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 2",
      price: "800.000 đ",
      priceValue: 800000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 25,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 6",
      price: "1.300.000 đ",
      priceValue: 1300000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 29,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 10",
      price: "1.700.000 đ",
      priceValue: 1700000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 201,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 11",
      price: "900.000 đ",
      priceValue: 900000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 202,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 12",
      price: "950.000 đ",
      priceValue: 950000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 203,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 13",
      price: "1.000.000 đ",
      priceValue: 1000000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 204,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 14",
      price: "1.050.000 đ",
      priceValue: 1050000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 205,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 15",
      price: "1.100.000 đ",
      priceValue: 1100000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 206,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 16",
      price: "1.150.000 đ",
      priceValue: 1150000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 207,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 17",
      price: "1.200.000 đ",
      priceValue: 1200000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 208,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 18",
      price: "1.250.000 đ",
      priceValue: 1250000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 209,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 19",
      price: "1.300.000 đ",
      priceValue: 1300000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 210,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 20",
      price: "1.350.000 đ",
      priceValue: 1350000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 211,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 21",
      price: "1.400.000 đ",
      priceValue: 1400000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 212,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 22",
      price: "1.450.000 đ",
      priceValue: 1450000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 213,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA HỒNG 23",
      price: "1.500.000 đ",
      priceValue: 1500000,
      category: "Bó hoa",
      subCategory: "Hoa Hồng",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    // Các sản phẩm khác trong Bó hoa
    {
      id: 1,
      image: "/img/hoa.png",
      title: "BÓ TULIP TRẮNG 20 BÔNG",
      price: "1.200.000 đ",
      priceValue: 1200000,
      category: "BST loài hoa",
      subCategory: "Hoa hướng dương",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x300",
      title: "URBAN GARDEN - Bó hoa mix...",
      price: "550.000 đ",
      priceValue: 550000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size M",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ TULIP XANH THAN MIX TRẮNG",
      price: "550.000 đ",
      priceValue: 550000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size S",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ CẨM TÚ CẦU XANH BLUE MIX",
      price: "750.000 đ",
      priceValue: 750000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size L",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 8,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ JULIET MIX TONE CAM - SIZE",
      price: "320.000 đ",
      priceValue: 320000,
      category: "Bó hoa",
      subCategory: "Hoa Ly",
      priceRange: "Dưới 500.000 đ",
    },
    {
      id: 11,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA TRUNG 1",
      price: "600.000 đ",
      priceValue: 600000,
      category: "Bó hoa",
      subCategory: "Hoa Lan",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 13,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ MINI 1",
      price: "300.000 đ",
      priceValue: 300000,
      category: "Bó hoa",
      subCategory: "Hoa Lan",
      priceRange: "Dưới 500.000 đ",
    },
    {
      id: 22,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 3",
      price: "900.000 đ",
      priceValue: 900000,
      category: "Bó hoa",
      subCategory: "Hoa Ly",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 23,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 4",
      price: "1.000.000 đ",
      priceValue: 1000000,
      category: "Bó hoa",
      subCategory: "Hoa Lan",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 24,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 5",
      price: "1.100.000 đ",
      priceValue: 1100000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size L",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 26,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 7",
      price: "1.400.000 đ",
      priceValue: 1400000,
      category: "Bó hoa",
      subCategory: "Hoa Ly",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 27,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 8",
      price: "1.500.000 đ",
      priceValue: 1500000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size L",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 28,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 9",
      price: "1.600.000 đ",
      priceValue: 1600000,
      category: "Bó hoa",
      subCategory: "Bó hoa Size L",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 30,
      image: "https://via.placeholder.com/300x300",
      title: "BÓ HOA 11",
      price: "1.800.000 đ",
      priceValue: 1800000,
      category: "Bó hoa",
      subCategory: "Hoa Ly",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    // Giỏ hoa
    {
      id: 6,
      image: "https://via.placeholder.com/300x300",
      title: "GIỎ HOA MÂY - TONE NÂU CAFE",
      price: "950.000 đ",
      priceValue: 950000,
      category: "Giỏ hoa",
      subCategory: "Giỏ Hoa Tươi",
      priceRange: "500.000 đ - 1.000.000 đ",
    },
    {
      id: 7,
      image: "https://via.placeholder.com/300x300",
      title: "PINK BLOSSOM BASKET - Giỏ hoa...",
      price: "1.200.000 đ",
      priceValue: 1200000,
      category: "Giỏ hoa",
      subCategory: "Giỏ Hoa Đẹp",
      priceRange: "1.000.000 đ - 2.000.000 đ",
    },
    {
      id: 9,
      image: "https://via.placeholder.com/300x300",
      title: "GIỎ HOA NHỎ 1",
      price: "400.000 đ",
      priceValue: 400000,
      category: "Giỏ hoa",
      subCategory: "Giỏ Hoa Tươi",
      priceRange: "Dưới 500.000 đ",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/300x300",
      title: "GIỎ HOA NHỎ 2",
      price: "450.000 đ",
      priceValue: 450000,
      category: "Giỏ hoa",
      subCategory: "Giỏ Hoa Đẹp",
      priceRange: "Dưới 500.000 đ",
    },
  ];

  // Tìm nhãn danh mục chính và phụ
  const findCategoryLabels = (categoryPath) => {
    let mainLabel = "";
    let subLabel = "";
    let subPath = "";

    for (const menuItem of menuItems) {
      const foundLink = menuItem.links.find(
        (link) => link.path === categoryPath
      );
      if (foundLink) {
        mainLabel = menuItem.name;
        subLabel = foundLink.label;
        subPath = `/products/${foundLink.path}`;
        break;
      }
    }

    if (!mainLabel || !subLabel) {
      mainLabel = "Danh mục";
      subLabel = categoryPath.replace(/-/g, " ");
      subPath = `/products/${categoryPath}`;
    }

    return { mainLabel, subLabel, subPath };
  };

  const { mainLabel, subLabel, subPath } = findCategoryLabels(category);

  // Fetch dữ liệu từ API hoặc dùng mockData nếu thất bại
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://your-api-endpoint.com/products?category=${category}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        const filteredByCategory = mockProducts.filter((product) => {
          const categoryNoDiacritics = removeDiacritics(category.replace(/[-]/g, " "));
          const subCategoryNoDiacritics = removeDiacritics(product.subCategory);
          console.log(categoryNoDiacritics, subCategoryNoDiacritics);
          
          return subCategoryNoDiacritics.includes(categoryNoDiacritics);
        });
        setProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);
      } finally {
        setTimeout(() => {
          setShowSkeleton(false);
        }, 500);
      }
    };
  
    fetchProducts();
  }, [category]);

  useEffect(() => {
    let filtered = [...products];
  
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((product) =>
        filters.priceRanges.some((range) => {
          if (range === "Dưới 500.000 đ") return product.priceValue < 500000;
          if (range === "500.000 đ - 1.000.000 đ")
            return product.priceValue >= 500000 && product.priceValue <= 1000000;
          if (range === "1.000.000 đ - 2.000.000 đ")
            return product.priceValue > 1000000 && product.priceValue <= 2000000;
          if (range === "Trên 2.000.000 đ") return product.priceValue > 2000000;
          return false;
        })
      );
    }
  
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.subCategory)
      );
    }
  
    setFilteredProducts(filtered);
  }, [products, filters]);
  
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
  
      if (filterType === "price") {
        if (updatedFilters.priceRanges.includes(value)) {
          // Nếu đã chọn, bỏ chọn
          updatedFilters.priceRanges = updatedFilters.priceRanges.filter(
            (range) => range !== value
          );
        } else {
          // Nếu chưa chọn, thêm vào
          updatedFilters.priceRanges.push(value);
        }
      } else if (filterType === "category") {
        // Giữ nguyên logic cho category nếu có
        if (updatedFilters.categories.includes(value)) {
          updatedFilters.categories = updatedFilters.categories.filter(
            (cat) => cat !== value
          );
        } else {
          updatedFilters.categories.push(value);
        }
      }
  
      return updatedFilters;
    });
  
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  // Sắp xếp sản phẩm
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
    setCurrentPage(0);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(
    offset,
    offset + productsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  // Đảm bảo luôn hiển thị 16 ô (4x4)
  const productSlots = Array.from({ length: productsPerPage }).map(
    (_, index) => {
      const product = currentProducts[index];
      return (
        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
          {showSkeleton ? (
            <div className="product-card-skeleton">
              <div className="product-image-skeleton"></div>
              <div className="product-title-skeleton"></div>
              <div className="product-price-skeleton"></div>
            </div>
          ) : product ? (
            <ProductCard product={product} />
          ) : (
            <div className="empty-product-slot"></div>
          )}
        </Col>
      );
    }
  );

  return (
    <div className="categories-page-wrapper">
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

            <Row>{productSlots}</Row>

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
