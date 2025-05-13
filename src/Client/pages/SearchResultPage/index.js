import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Breadcrumb } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaEye, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import ProductModal from "../../components/ProductModal";
import { getPublicNative } from "../../../share/utils/http";
import "./SearchResultPage.css"; 

function SearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const productsPerPage = 10;
  const { addToCart, getCartItemQuantity } = useCart();

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return formatPrice(Math.round(discountedValue));
  };

  // Lấy query parameters từ URL
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const minPrice = queryParams.get("minPrice") || "";
  const maxPrice = queryParams.get("maxPrice") || "";
  const categorySlug = queryParams.get("categorySlug") || "";
  const sortBy = queryParams.get("sortBy") || "relevance";
  const order = queryParams.get("order") || "desc";
  const page = parseInt(queryParams.get("page")) || 1;
  const limit = parseInt(queryParams.get("limit")) || 10;

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          keyword: keyword,
          page: currentPage,
          limit: productsPerPage,
        });

        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (categorySlug) query.append("categorySlug", categorySlug);
        if (sortBy) query.append("sortBy", sortBy);
        if (order) query.append("order", order);

        const data = await getPublicNative(`/v1/search?${query.toString()}`);
        console.log("Search API Response:", data);

        const productData = data.data || [];
        const total = data.totalProduct || productData.length;

        if (!Array.isArray(productData)) {
          throw new Error("API response không phải là mảng");
        }

        const formattedProducts = productData.map((product) => ({
          id: product._id,
          image: product.thumbnail,
          title: product.title,
          price: formatPrice(product.price),
          priceValue: product.price,
          discount: product.discountPercentage || 0,
          stock: product.stock || 0,
          slug: product.slug,
          discountedPrice: product.discountPercentage
            ? calculateDiscountedPrice(product.price, product.discountPercentage)
            : null,
        }));

        setProducts(formattedProducts);
        setTotalProducts(total);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        setError("Không thể tải kết quả tìm kiếm. Vui lòng thử lại sau.");
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, minPrice, maxPrice, categorySlug, sortBy, order, currentPage]);

  const handleAddToCart = (product) => {
    const currentInCart = getCartItemQuantity(product.id) || 0;
    const totalQuantity = currentInCart + quantity;

    if (totalQuantity > product.stock) {
      alert(
        `Không thể thêm vào giỏ hàng! Tổng số lượng (${totalQuantity}) vượt quá số lượng còn lại (${product.stock}).`
      );
      return;
    }

    addToCart(product, quantity);
    setShowModal(false);
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      queryParams.set("page", currentPage - 1);
      navigate(`/search?${queryParams.toString()}`);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      queryParams.set("page", currentPage + 1);
      navigate(`/search?${queryParams.toString()}`);
    }
  };

  return (
    <div className="search-results-page-wrapper">
      <div className="category-banner">
        <h1 className="banner-title">
          Kết quả tìm kiếm cho: "{keyword}"
        </h1>
      </div>

      <Container className="categories-page py-5">
        <Row>
          <Col md={12}>
            <Breadcrumb className="category-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                Tìm kiếm: {keyword}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className="products-header d-flex justify-content-end align-items-center mb-4">
              <span className="total-product">{totalProducts} Sản Phẩm</span>
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
            ) : products.length === 0 ? (
              <div className="text-center">Không tìm thấy sản phẩm nào.</div>
            ) : (
              <Row>
                {products.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="categories-bouquet-card">
                      <div className="categories-bouquet-image-wrapper">
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.title}
                          className="categories-bouquet-image"
                          onClick={() => handleProductClick(product.slug)}
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

            {totalProducts > productsPerPage && (
              <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
                <Button
                  variant="outline-primary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="pagination-btn me-3"
                >
                  Trước
                </Button>

                <div className="pagination-numbers">
                  {Array.from({ length: Math.ceil(totalProducts / productsPerPage) }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant="outline-primary"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          queryParams.set("page", pageNum);
                          navigate(`/search?${queryParams.toString()}`);
                        }}
                        className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline-primary"
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(totalProducts / productsPerPage)}
                  className="pagination-btn ms-3"
                >
                  Sau
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

export default SearchResultPage;