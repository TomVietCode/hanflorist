import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Breadcrumb, Card, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Sidebar from "../../components/SideBar";
import "./CategoriesPages.css";
import { get } from "../../../share/utils/http";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

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
  const productsPerPage = 16; // 4x4 grid
  const { addToCart } = useCart();

  // Hàm định dạng giá
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  // Hàm tính giá giảm
  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return formatPrice(Math.round(discountedValue));
  };

  // Hàm xác định khoảng giá
  const determinePriceRange = (price) => {
    if (price < 500000) return "Dưới 500.000 đ";
    if (price >= 500000 && price <= 1000000) return "500.000 đ - 1.000.000 đ";
    if (price > 1000000 && price <= 2000000) return "1.000.000 đ - 2.000.000 đ";
    return "Trên 2.000.000 đ";
  };

  // Tạm thời hardcode vì menuItems chưa khả dụng
  const mainLabel = "Danh mục";
  const subLabel = category.replace(/-/g, " ");
  const subPath = `/products/${category}`;

  // Gọi API để lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get("", "/v1/products");
        console.log("API Response:", response);

        const productData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!Array.isArray(productData)) {
          throw new Error("API response không phải là mảng");
        }

        const products = productData.map((product) => ({
          id: product._id,
          image: product.thumbnail,
          title: product.title,
          price: formatPrice(product.price),
          priceValue: product.price,
          discount: product.discountPercentage || 0,
          stock: product.stock || 0,
          category: product.category || "",
          subCategory: product.subCategory || "",
          priceRange: determinePriceRange(product.price),
          discountedPrice: product.discountPercentage
            ? calculateDiscountedPrice(product.price, product.discountPercentage)
            : null,
        }));

        // Lọc sản phẩm theo danh mục
        const filteredByCategory = products.filter((product) => {
          const categoryNoDiacritics = removeDiacritics(category.replace(/[-]/g, " "));
          const subCategoryNoDiacritics = removeDiacritics(product.subCategory);
          return subCategoryNoDiacritics.includes(categoryNoDiacritics);
        });

        setProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [category]);

  // Lọc sản phẩm dựa trên bộ lọc (giá, danh mục)
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
          updatedFilters.priceRanges = updatedFilters.priceRanges.filter(
            (range) => range !== value
          );
        } else {
          updatedFilters.priceRanges.push(value);
        }
      } else if (filterType === "category") {
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

    setCurrentPage(0);
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

  // Phân trang
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

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  // Hàm xử lý xem chi tiết (tạm thời để trống vì chưa có modal)
  const handleViewDetails = (product) => {
    console.log("Xem chi tiết sản phẩm:", product);
  };

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
                <span>{filteredProducts.length} Sản Phẩm</span>
                <Form.Select
                  className="sort-select ms-3"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Sắp Xếp: Mặc Định</option>
                  <option value="price-asc">Giá: Thấp Đến Cao</option>
                  <option value="price-desc">Giá: Cao Đến Thấp</option>
                  <option value="name-asc">Tên: A đến Z</option>
                  <option value="name-desc">Tên: Z đến A</option>
                </Form.Select>
              </div>
            </div>

            <Row>
              {currentProducts.length === 0 ? (
                <Col>
                  <p>Không có sản phẩm nào trong danh mục này.</p>
                </Col>
              ) : (
                currentProducts.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="categories-bouquet-card">
                      <div className="categories-bouquet-image-wrapper">
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.title}
                          className="categories-bouquet-image"
                        />
                        {product.discount > 0 && (
                          <div className="categories-discount-badge">{`${product.discount}% OFF`}</div>
                        )}
                        <div className="categories-bouquet-overlay">
                          <button
                            className="categories-overlay-button"
                            onClick={() => handleAddToCart(product)}
                          >
                            <HiOutlineShoppingBag />
                          </button>
                          <button
                            className="categories-overlay-button"
                            onClick={() => handleViewDetails(product)}
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="categories-bouquet-title">{product.title}</Card.Title>
                        <Card.Text className="categories-bouquet-price">
                          {product.discount > 0 ? (
                            <>
                              <span className="categories-original-price">{product.price}</span>
                              <span className="categories-discounted-price">{product.discountedPrice}</span>
                            </>
                          ) : (
                            product.price
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
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