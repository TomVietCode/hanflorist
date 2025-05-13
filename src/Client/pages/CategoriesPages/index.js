import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Breadcrumb,
  Card,
  Button,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import "./CategoriesPages.css";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import ProductModal from "../../components/ProductModal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getPublic, getPublicNative } from '../../../share/utils/http';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const productsPerPage = 12;
  const { addToCart, getCartItemQuantity } = useCart();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setBannerLoading(true);
        const data = await getPublic("/v1/categories/");

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Không thể lấy danh sách danh mục");
        }
      } catch (err) {
        setError(err.message || "Không thể lấy danh sách danh mục");
      } finally {
        setBannerLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: currentPage,
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

        const data = await getPublic(`/v1/products/category/${category}?${queryParams.toString()}`);
        console.log("API Response:", data);

        const productData = data.data || [];
        const total = data.totalProduct || productData.length;

        if (!Array.isArray(productData)) {
          throw new Error("API response không phải là mảng");
        }

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
          categoryId: product.categoryId || "",
          priceRange: determinePriceRange(product.price),
          discountedPrice: product.discountPercentage
            ? calculateDiscountedPrice(
                product.price,
                product.discountPercentage
              )
            : null,
          slug: product.slug,
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
  }, [category, sortOption, filters, currentPage, categories]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
    });
    setSortOption("default");
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    const currentInCart = getCartItemQuantity(product.id) || 0;
    const maxQuantity = product.stock - currentInCart;
    setQuantity(maxQuantity > 0 ? 1 : 0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const currentInCart = getCartItemQuantity(selectedProduct?.id) || 0;
      const maxQuantity = selectedProduct?.stock - currentInCart;

      const newQuantity = prev + change;
      if (newQuantity > maxQuantity) {
        alert(`Bạn chỉ có thể thêm tối đa ${maxQuantity} sản phẩm nữa!`);
        return prev;
      }
      if (newQuantity < 1) {
        return 1;
      }
      return newQuantity;
    });
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="categories-page-wrapper">
      <div className="category-banner">
        {bannerLoading ? (
          <div className="banner-skeleton">
            <div className="skeleton-banner-title" />
          </div>
        ) : (
          <h1 className="banner-title">
            {mainLabel || "Danh mục"} -{" "}
            <Link to={subPath} className="banner-subcategory">
              {subLabel || "Đang tải..."}
            </Link>
          </h1>
        )}
      </div>

      <Container className="categories-page py-5">
        <Row>
          <Col md={3}>
            <Sidebar
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Col>
          <Col md={9}>
            <Breadcrumb className="category-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                {mainLabel || "Danh mục"} - {subLabel || "Đang tải..."}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className="products-header d-flex justify-content-end align-items-center mb-4">
              <span className="total-product">{totalProducts} Sản Phẩm</span>
              <div className="products-meta">
                <Form.Select
                  className="sort-select ms-3 Form.Select"
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
                  <Col
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-4"
                  >
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
              <div className="text-center">
                Không có sản phẩm nào trong danh mục này.
              </div>
            ) : (
              <Row>
                {filteredProducts.map((product) => (
                  <Col
                    key={product.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-4"
                  >
                    <Card className="categories-bouquet-card">
                      <div className="categories-bouquet-image-wrapper">
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.title}
                          className="categories-bouquet-image"
                          onClick={() => handleProductClick(product.slug)} // Điều hướng khi click vào hình ảnh
                          style={{ cursor: "pointer" }}
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
                        <Card.Title
                          className="categories-bouquet-title"
                          onClick={() => handleProductClick(product.slug)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.title}
                        </Card.Title>
                        <Card.Text className="categories-bouquet-price">
                          {product.discount > 0 ? (
                            <>
                              <span className="categories-original-price">
                                {product.price}
                              </span>
                              <span className="categories-discounted-price">
                                {product.discountedPrice}
                              </span>
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

            {totalProducts > productsPerPage && (
              <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
                <Button
                  variant="outline-primary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="pagination-btn me-3"
                >
                  <FaArrowLeft />
                </Button>

                {/* Thêm các số trang */}
                <div className="pagination-numbers">
                  {Array.from(
                    { length: Math.ceil(totalProducts / productsPerPage) },
                    (_, index) => {
                      const page = index + 1;
                      return (
                        <Button
                          key={page}
                          variant="outline-primary"
                          onClick={() => setCurrentPage(page)}
                          className={`pagination-number ${currentPage === page ? "active" : ""}`}
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline-primary"
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(totalProducts / productsPerPage)
                  }
                  className="pagination-btn ms-3"
                >
                  <FaArrowRight />
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <ProductModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedProduct={selectedProduct}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleAddToCart={handleAddToCart}
        getCartItemQuantity={getCartItemQuantity}
      />
    </div>
  );
}

export default CategoriesPages;
