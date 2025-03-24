import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Breadcrumb, Card, Button, Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Sidebar from "../../components/SideBar";
import "./CategoriesPages.css";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

function CategoriesPages() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [mainLabel, setMainLabel] = useState("Danh mục");
  const [subLabel, setSubLabel] = useState("");
  const [subPath, setSubPath] = useState(`/categories/${category}`);
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
  });
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 16;
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return formatPrice(Math.round(discountedValue));
  };

  const determinePriceRange = (price) => {
    if (price < 500000) return "Dưới 500.000 đ";
    if (price >= 500000 && price <= 1000000) return "500.000 đ - 1.000.000 đ";
    if (price > 1000000 && price <= 2000000) return "1.000.000 đ - 2.000.000 đ";
    return "Trên 2.000.000 đ";
  };

  // Gọi API /v1/categories để lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/v1/categories/", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Không thể lấy danh sách danh mục");
        }
      } catch (err) {
        setError(err.message || "Không thể lấy danh sách danh mục");
      }
    };

    fetchCategories();
  }, []);

  // Gọi API để lấy sản phẩm theo danh mục và cập nhật subLabel
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const page = currentPage + 1;
        const queryParams = new URLSearchParams({
          page,
          limit: productsPerPage,
        });

        if (sortOption !== "default") {
          const [sortBy, order] = sortOption.split("-");
          queryParams.append("sortBy", sortBy);
          queryParams.append("order", order);
        }

        if (filters.priceRanges.length > 0) {
          const minPrice = filters.priceRanges.includes("Dưới 500.000 đ")
            ? 0
            : filters.priceRanges.includes("500.000 đ - 1.000.000 đ")
            ? 500000
            : filters.priceRanges.includes("1.000.000 đ - 2.000.000 đ")
            ? 1000001
            : 2000001;

          const maxPrice = filters.priceRanges.includes("Dưới 500.000 đ")
            ? 500000
            : filters.priceRanges.includes("500.000 đ - 1.000.000 đ")
            ? 1000000
            : filters.priceRanges.includes("1.000.000 đ - 2.000.000 đ")
            ? 2000000
            : undefined;

          if (minPrice) queryParams.append("minPrice", minPrice);
          if (maxPrice) queryParams.append("maxPrice", maxPrice);
        }

        const response = await fetch(
          `http://localhost:3001/v1/products/category/${category}?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const productData = data.data || [];
        const total = data.paging?.total || productData.length;

        if (!Array.isArray(productData)) {
          throw new Error("API response không phải là mảng");
        }

        // Tìm subLabel từ categories dựa trên categoryId của sản phẩm
        let foundSubLabel = category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (productData.length > 0 && categories.length > 0) {
          const categoryId = productData[0].categoryId;
          categories.forEach((mainCategory) => {
            if (mainCategory.children) {
              const subCategory = mainCategory.children.find(
                (sub) => sub._id === categoryId
              );
              if (subCategory) {
                foundSubLabel = subCategory.title;
                setMainLabel(mainCategory.title);
              }
            }
          });
        }

        setSubLabel(foundSubLabel);
        setSubPath(`/categories/${category}`);

        const formattedProducts = productData.map((product) => ({
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

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setTotalProducts(total);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
        setFilteredProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, sortOption, filters, categories]);

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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(0);
  };

  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

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
                <span>{totalProducts} Sản Phẩm</span>
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

            {loading ? (
              <Row>
                {[...Array(8)].map((_, index) => (
                  <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="categories-bouquet-card skeleton">
                      <div className="categories-bouquet-image-wrapper">
                        <div className="skeleton-image" />
                      </div>
                      <Card.Body>
                        <div className="skeleton-title" />
                        <div className="skeleton-price" />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : error ? (
              <div className="text-center text-danger">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center">Không có sản phẩm nào trong danh mục này.</div>
            ) : (
              <Row>
                {filteredProducts.map((product) => (
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
                ))}
              </Row>
            )}

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