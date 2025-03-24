import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FaShippingFast } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./MainContent.css";
import { useCart } from "../../context/CartContext";
import { get } from "../../../share/utils/http";

function MainContent() {
  const [allProducts, setAllProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("8.3 Collection");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartItemQuantity } = useCart();

  const filters = [
    "8.3 Collection",
    "Giỏ hoa Size S",
    "Bó hoa Size M",
    "Hoa Cưới",
    "Bó hoa Mini",
    "Combo Cưới",
  ];

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return formatPrice(Math.round(discountedValue));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get("", "/v1/products");
        console.log("API Response:", response);

        // Kiểm tra nếu response không phải là mảng và truy cập response.data nếu cần
        const productData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!Array.isArray(productData)) {
          throw new Error("API response is not an array");
        }

        const products = productData.map((product) => ({
          id: product._id,
          image: product.thumbnail,
          title: product.title,
          price: formatPrice(product.price),
          priceValue: product.price,
          discount: product.discountPercentage || 0,
          stock: product.stock || 0,
        }));

        setAllProducts(products);

        const dealProducts = products
          .filter((product) => product.discount > 0)
          .slice(0, 5)
          .map((product) => ({
            ...product,
            discount: `${product.discount}% OFF`,
            originalPrice: product.price,
            discountedPrice: calculateDiscountedPrice(
              product.priceValue,
              product.discount
            ),
          }));

        const groupedCategories = filters.map((filter) => ({
          name: filter,
          products: products
            .filter((product) => {
              if (filter === "8.3 Collection") return product.discount > 0;
              if (filter === "Giỏ hoa Size S")
                return product.priceValue < 500000;
              if (filter === "Bó hoa Size M")
                return (
                  product.priceValue >= 500000 && product.priceValue <= 1000000
                );
              if (filter === "Hoa Cưới")
                return (
                  product.priceValue > 1000000 && product.priceValue <= 1500000
                );
              if (filter === "Bó hoa Mini") return product.priceValue < 300000;
              if (filter === "Combo Cưới") return product.priceValue > 1500000;
              return false;
            })
            .slice(0, 8)
            .map((product) => ({
              ...product,
              discountedPrice: product.discount
                ? calculateDiscountedPrice(product.priceValue, product.discount)
                : null,
            })),
        }));

        setDeals(dealProducts);
        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
        setDeals([]);
        setCategories([]);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

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

  const activeProducts =
    categories.find((cat) => cat.name === activeCategory)?.products || [];

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
              className="deal-col mb-4"
            >
              <Card className="deal-card">
                <div className="deal-image-wrapper">
                  <Card.Img
                    variant="top"
                    src={deal.image}
                    alt={deal.title}
                    className="deal-image uniform-image" // Thêm class để áp dụng kiểu dáng
                  />
                  <div className="discount-badge">{deal.discount}</div>
                  <div className="deal-overlay">
                    <button
                      className="overlay-button"
                      onClick={() => handleAddToCart(deal)}
                    >
                      <HiOutlineShoppingBag />
                    </button>
                    <button
                      className="overlay-button"
                      onClick={() => handleViewDetails(deal)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="deal-title">{deal.title}</Card.Title>
                  <Card.Text className="deal-price">
                    <span className="original-price">{deal.originalPrice}</span>
                    <span className="discounted-price">
                      {deal.discountedPrice}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button className="explore-button">THAM KHẢO NGAY</Button>
        </div>
      </Container>

      <Container className="main-content py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="this-month-label">THIS MONTH</span>
            <h1 className="trendy-collection-title">TRENDY COLLECTION</h1>
          </div>
          <div className="filter-links">
            {filters.map((filter) => (
              <a
                key={filter}
                href="#"
                className={`filter-link me-3 ${activeCategory === filter ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFilterClick(filter);
                }}
              >
                {filter}
              </a>
            ))}
          </div>
        </div>

        <Row>
          {activeProducts.map((bouquet) => (
            <Col key={bouquet.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="bouquet-card">
                <div className="bouquet-image-wrapper">
                  <Card.Img
                    variant="top"
                    src={bouquet.image}
                    alt={bouquet.title}
                    className="bouquet-image uniform-image" // Thêm class để áp dụng kiểu dáng
                  />
                  {bouquet.discount > 0 && (
                    <div className="discount-badge">{`${bouquet.discount}% OFF`}</div>
                  )}
                  <div className="bouquet-overlay">
                    <button
                      className="overlay-button"
                      onClick={() => handleAddToCart(bouquet)}
                    >
                      <HiOutlineShoppingBag />
                    </button>
                    <button
                      className="overlay-button"
                      onClick={() => handleViewDetails(bouquet)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="bouquet-title">
                    {bouquet.title}
                  </Card.Title>
                  <Card.Text className="bouquet-price">
                    {bouquet.discount > 0 ? (
                      <>
                        <span className="original-price">{bouquet.price}</span>
                        <span className="discounted-price">
                          {bouquet.discountedPrice}
                        </span>
                      </>
                    ) : (
                      bouquet.price
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <img
                src={selectedProduct?.image}
                alt={selectedProduct?.title}
                className="img-fluid product-modal-image"
              />
            </Col>
            <Col md={6}>
              <h4>
                {selectedProduct?.discountedPrice || selectedProduct?.price}
              </h4>
              <p>
                <strong>Số lượng còn lại:</strong> {selectedProduct?.stock}
              </p>
              <p>
                <strong>Số lượng trong giỏ hàng:</strong>{" "}
                {getCartItemQuantity(selectedProduct?.id) || 0}
              </p>
              <p>
                <strong>Số lượng tối đa có thể thêm:</strong>{" "}
                {selectedProduct?.stock -
                  (getCartItemQuantity(selectedProduct?.id) || 0)}
              </p>
              <div className="quantity-selector d-flex align-items-center my-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </Button>
                <span className="mx-3">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    quantity >=
                    selectedProduct?.stock -
                      (getCartItemQuantity(selectedProduct?.id) || 0)
                  }
                >
                  <FaPlus />
                </Button>
              </div>
              <Button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={
                  quantity === 0 ||
                  selectedProduct?.stock -
                    (getCartItemQuantity(selectedProduct?.id) || 0) <=
                    0
                }
              >
                ADD TO CART
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MainContent;