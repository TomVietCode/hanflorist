import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShippingFast } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import "./MainContent.css";
import { useCart } from "../../context/CartContext";
import { get } from "../../../share/utils/http";
import ProductModal from "../ProductModal";

function MainContent() {
  const [allProducts, setAllProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); // Danh sách danh mục cha
  const [activeCategory, setActiveCategory] = useState(null); // Danh mục cha đang active
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return Math.round(discountedValue); // Trả về số
  };

  // Lấy danh sách danh mục cha từ API /v1/categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get("", "/v1/categories");
        console.log("Categories Response:", response);

        const categoryData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!Array.isArray(categoryData)) {
          throw new Error("API response for categories is not an array");
        }

        // Lọc danh mục cha (các danh mục không có parentId)
        const parentCats = categoryData.filter((cat) => !cat.parentId);
        setParentCategories(parentCats);

        // Đặt danh mục cha đầu tiên làm active (nếu có)
        if (parentCats.length > 0) {
          setActiveCategory(parentCats[0].slug);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setParentCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Lấy sản phẩm cho từng danh mục cha
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get("", "/v1/products");
        console.log("Products Response:", response);
        
        const productData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!Array.isArray(productData)) {
          throw new Error("API response for products is not an array");
        }

        const products = productData.map((product) => ({
          id: product._id,
          image: product.thumbnail,
          title: product.title,
          price: product.price, // Lưu price dưới dạng số
          priceValue: product.price,
          discount: product.discountPercentage || 0,
          stock: product.stock || 0,
          slug: product.slug,
        }));

        setAllProducts(products);

        const dealProducts = products
          .filter((product) => product.discount > 0)
          .slice(0, 5)
          .map((product) => ({
            ...product,
            discount: `${product.discount}% OFF`,
            discountPercentage: product.discount,
            originalPrice: formatPrice(product.price),
            discountedPrice: calculateDiscountedPrice(
              product.price,
              product.discount
            ),
          }));

        setDeals(dealProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
        setDeals([]);
      }
    };

    fetchProducts();
  }, []);

  // Lấy sản phẩm theo danh mục cha
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!parentCategories.length) return;

      try {
        const categoryProducts = await Promise.all(
          parentCategories.map(async (category) => {
            const response = await get(
              "",
              `/v1/products/category/${category.slug}`
            );

            const productData = Array.isArray(response)
              ? response
              : response?.data || [];

            if (!Array.isArray(productData)) {
              throw new Error(
                `API response for category ${category.slug} is not an array`
              );
            }

            const products = productData
              .slice(0, 4) // Giới hạn tối đa 4 sản phẩm
              .map((product) => ({
                id: product._id,
                image: product.thumbnail,
                title: product.title,
                price: product.price, // Lưu price dưới dạng số
                priceValue: product.price,
                discount: product.discountPercentage || 0,
                stock: product.stock || 0,
                slug: product.slug,
                discountedPrice: product.discountPercentage
                  ? calculateDiscountedPrice(
                      product.price,
                      product.discountPercentage
                    )
                  : null,
              }));

            return {
              name: category.title,
              slug: category.slug,
              products,
            };
          })
        );

        setCategories(categoryProducts);
      } catch (error) {
        console.error("Error fetching products by category:", error);
        setCategories([]);
      }
    };

    fetchProductsByCategory();
  }, [parentCategories]);

  const handleFilterClick = (categorySlug) => {
    setActiveCategory(categorySlug);
  };

  const handleAddToCart = (product) => {
    console.log(product.image)
    const currentInCart = getCartItemQuantity(product.id) || 0;
    const totalQuantity = currentInCart + quantity;

    if (totalQuantity > product.stock) {
      alert(
        `Không thể thêm vào giỏ hàng! Tổng số lượng (${totalQuantity}) vượt quá số lượng còn lại (${product.stock}).`
      );
      return;
    }
    addToCart(
      {
        id: product.id,
        title: product.title,
        priceValue: product.priceValue, 
        discount: product.discountPercentage || 0,
        image: product.image,
        stock: product.stock,
      },
      quantity
    );
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

  const activeProducts =
    categories.find((cat) => cat.slug === activeCategory)?.products || [];

  return (
    <>
      <Container className="service-section py-5">
        <Row>
          <Col md={4} className="d-flex align-items-center mb-4 mb-md-0">
            <div className="service-icon">
              <FaShippingFast size={60} />
            </div>
            <div>
              <h5 className="service-title">
                <strong>DELIVERY IN HANOI</strong>
              </h5>
              <p className="service-text">
                Shop giao hàng khu vực nội thành và ngoại thành Hà Nội với mức
                ưu đãi đặc biệt
              </p>
            </div>
          </Col>
          <Col md={4} className="d-flex align-items-center mb-4 mb-md-0">
            <div className="service-icon">
              <CiCreditCard1 size={60} />
            </div>
            <div>
              <h5 className="service-title">
                <strong>ĐỔI TRẢ VÀ HOÀN TIỀN</strong>
              </h5>
              <p className="service-text">
                Nếu khách hàng không hài lòng với sản phẩm shop sẽ thu xếp để
                đổi trả hoặc hoàn lại tiền theo mong muốn của khách hàng
              </p>
            </div>
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <div className="service-icon">
              <FaRegHandshake size={60} />
            </div>
            <div>
              <h5 className="service-title">
                <strong>UY TÍN & CHẤT LƯỢNG</strong>
              </h5>
              <p className="service-text">
                Han Florist luôn nỗ lực để mang lại những sản phẩm hoàn thiện
                nhất và tươi mới nhất đến tay khách hàng
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="deals-section py-5">
        <div className="text-center mb-4">
          <span className="top-sale-label">TOP SALE</span>
          <h1 className="sale-collection-title">GIẢM GIÁ HÔM NAY</h1>
        </div>
        <Row>
          {deals.map((deal) => (
            <Col
              key={deal.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              className="mb-4"
            >
              <Card className="categories-bouquet-card">
                <div className="categories-bouquet-image-wrapper">
                  <Card.Img
                    variant="top"
                    src={deal.image}
                    alt={deal.title}
                    className="categories-bouquet-image"
                    onClick={() => handleProductClick(deal.slug)}
                    style={{ cursor: "pointer" }}
                  />
                  {deal.discount && (
                    <div className="categories-discount-badge">{deal.discount}</div>
                  )}
                  <div className="categories-bouquet-overlay">
                    <button
                      className="categories-overlay-button"
                      onClick={() => handleAddToCart(deal)}
                    >
                      <HiOutlineShoppingBag />
                    </button>
                    <button
                      className="categories-overlay-button"
                      onClick={() => handleViewDetails(deal)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title
                    className="categories-bouquet-title"
                    onClick={() => handleProductClick(deal.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    {deal.title}
                  </Card.Title>
                  <Card.Text className="categories-bouquet-price">
                    {deal.discount ? (
                      <>
                        <span className="categories-original-price">{deal.originalPrice}</span>
                        <span className="categories-discounted-price">
                          {formatPrice(deal.discountedPrice)}
                        </span>
                      </>
                    ) : (
                      formatPrice(deal.price)
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="main-content py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="this-month-label">THIS MONTH</span>
            <h1 className="trendy-collection-title">TRENDY COLLECTION</h1>
          </div>
          <div className="filter-links">
            {parentCategories.map((category) => (
              <a
                key={category._id}
                href="#"
                className={`filter-link me-3 ${activeCategory === category.slug ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFilterClick(category.slug);
                }}
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>

        <Row>
          {activeProducts.map((bouquet) => (
            <Col key={bouquet.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="categories-bouquet-card">
                <div className="categories-bouquet-image-wrapper">
                  <Card.Img
                    variant="top"
                    src={bouquet.image}
                    alt={bouquet.title}
                    className="categories-bouquet-image"
                    onClick={() => handleProductClick(bouquet.slug)}
                    style={{ cursor: "pointer" }}
                  />
                  {bouquet.discount > 0 && (
                    <div className="categories-discount-badge">{`${bouquet.discount}% OFF`}</div>
                  )}
                  <div className="categories-bouquet-overlay">
                    <button
                      className="categories-overlay-button"
                      onClick={() => handleAddToCart(bouquet)}
                    >
                      <HiOutlineShoppingBag />
                    </button>
                    <button
                      className="categories-overlay-button"
                      onClick={() => handleViewDetails(bouquet)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title
                    className="categories-bouquet-title"
                    onClick={() => handleProductClick(bouquet.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    {bouquet.title}
                  </Card.Title>
                  <Card.Text className="categories-bouquet-price">
                    {bouquet.discount > 0 ? (
                      <>
                        <span className="categories-original-price">{formatPrice(bouquet.price)}</span>
                        <span className="categories-discounted-price">{formatPrice(bouquet.discountedPrice)}</span>
                      </>
                    ) : (
                      formatPrice(bouquet.price)
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
    </>
  );
}

export default MainContent;