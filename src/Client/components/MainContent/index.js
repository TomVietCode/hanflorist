import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FaShippingFast } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./MainContent.css";
import { useCart } from "../../context/CartContext";

function MainContent() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("8.3 Collection");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const filters = [
    "8.3 Collection",
    "Giỏ hoa Size S",
    "Bó hoa Size M",
    "Hoa Cưới",
    "Bó hoa Mini",
    "Combo Cưới",
  ];

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price.replace(/[^0-9]/g, ""));
    const discountPercentage = parseFloat(discount) || 0;
    const discountedValue = priceValue * (1 - discountPercentage / 100);
    return `${Math.round(discountedValue).toLocaleString("vi-VN")} đ`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api.example.com/products");
        const data = await response.json();

        const products = data.products.map((product) => ({
          id: product.id,
          image: product.image,
          title: product.title,
          price: product.price,
          category: product.category,
          isDeal: product.isDeal,
          discount: product.discount || 0,
          sku: product.sku,
          categories: product.categories,
        }));

        const groupedCategories = filters.map((filter) => ({
          name: filter,
          products: products
            .filter((product) => product.category === filter && !product.isDeal)
            .slice(0, 8)
            .map((product) => ({
              ...product,
              discountedPrice: product.discount
                ? calculateDiscountedPrice(product.price, product.discount)
                : null,
            })),
        }));

        const dealProducts = products
          .filter((product) => product.isDeal)
          .slice(0, 5)
          .map((product) => ({
            ...product,
            discount: `${product.discount}% OFF`,
            originalPrice: product.price,
            discountedPrice: calculateDiscountedPrice(product.price, product.discount),
          }));

        setCategories(groupedCategories);
        setDeals(dealProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        const mockProducts = [
          { id: 1, image: "/img/hoa.png", title: "BÓ TULIP TRẮNG 20 BÔNG", price: "1.200.000 đ", category: "8.3 Collection", isDeal: false, discount: 5, sku: "BO.L01", categories: ["Bó hoa", "Size L", "Hoa Tulip"] },
          { id: 2, image: "https://via.placeholder.com/300x300", title: "URBAN GARDEN - Bó hoa mix...", price: "550.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L02", categories: ["Bó hoa", "Size M"] },
          { id: 3, image: "https://via.placeholder.com/300x300", title: "BÓ TULIP XANH THAN MIX TRẮNG", price: "550.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L03", categories: ["Bó hoa", "Size S"] },
          { id: 4, image: "https://via.placeholder.com/300x300", title: "BÓ CẨM TÚ CẦU XANH BLUE MIX", price: "750.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L04", categories: ["Bó hoa", "Size L"] },
          { id: 5, image: "https://via.placeholder.com/300x300", title: "BÓ HOA TONE ĐỎ HỒNG MIX TULIP", price: "1.200.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L05", categories: ["Bó hoa", "Hoa Hồng"] },
          { id: 6, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA MÂY - TONE NÂU CAFE", price: "950.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L06", categories: ["Bó hoa", "Hoa Lily"] },
          { id: 7, image: "https://via.placeholder.com/300x300", title: "PINK BLOSSOM BASKET - Giỏ hoa...", price: "1.200.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L07", categories: ["Bó hoa", "Hoa Lan"] },
          { id: 8, image: "https://via.placeholder.com/300x300", title: "BÓ JULIET MIX TONE CAM - SIZE", price: "320.000 đ", category: "8.3 Collection", isDeal: false, discount: 0, sku: "BO.L08", categories: ["Bó hoa", "Hướng Dương"] },
          { id: 9, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA NHỎ 1", price: "400.000 đ", category: "Giỏ hoa Size S", isDeal: false, discount: 0, sku: "GI.S01", categories: ["Giỏ hoa", "Size S"] },
          { id: 10, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA NHỎ 2", price: "450.000 đ", category: "Giỏ hoa Size S", isDeal: false, discount: 0, sku: "GI.S02", categories: ["Giỏ hoa", "Size S"] },
          { id: 11, image: "https://via.placeholder.com/300x300", title: "BÓ HOA TRUNG 1", price: "600.000 đ", category: "Bó hoa Size M", isDeal: false, discount: 0, sku: "BO.M01", categories: ["Bó hoa", "Size M"] },
          { id: 12, image: "https://via.placeholder.com/300x300", title: "HOA CƯỚI 1", price: "800.000 đ", category: "Hoa Cưới", isDeal: false, discount: 0, sku: "HC.01", categories: ["Hoa Cưới"] },
          { id: 13, image: "https://via.placeholder.com/300x300", title: "BÓ MINI 1", price: "300.000 đ", category: "Bó hoa Mini", isDeal: false, discount: 0, sku: "BO.MI01", categories: ["Bó hoa", "Size Mini"] },
          { id: 14, image: "/img/hoa.png", title: "COMBO CƯỚI 1", price: "1.000.000 đ", category: "Combo Cưới", isDeal: false, discount: 0, sku: "CC.01", categories: ["Combo Cưới"] },
          { id: 15, image: "/img/hoa.png", title: "VIOLET DREAMS BOUQUET", price: "750.000 đ", category: "Bó hoa", isDeal: true, discount: 50, sku: "BO.D01", categories: ["Bó hoa", "Size L"] },
          { id: 16, image: "https://via.placeholder.com/300x300", title: "GIỎ HOA TONE ĐỎ ĐẬM SIZE", price: "1.490.000 đ", category: "Giỏ hoa", isDeal: true, discount: 5, sku: "GI.D01", categories: ["Giỏ hoa", "Size M"] },
          { id: 17, image: "https://via.placeholder.com/300x300", title: "BÓ HOA TONE HỒNG PAST", price: "350.000 đ", category: "Bó hoa", isDeal: true, discount: 5, sku: "BO.D02", categories: ["Bó hoa", "Size S"] },
          { id: 18, image: "https://via.placeholder.com/300x300", title: "BÓ HỒNG BUTTER CUP VÀ", price: "450.000 đ", category: "Bó hoa", isDeal: true, discount: 5, sku: "BO.D03", categories: ["Bó hoa", "Hoa Hồng"] },
          { id: 19, image: "https://via.placeholder.com/300x300", title: "HƯỚNG DƯƠNG MIX BAB", price: "130.000 đ", category: "Bó hoa", isDeal: true, discount: 10, sku: "BO.D04", categories: ["Bó hoa", "Hướng Dương"] },
        ];

        const groupedCategories = filters.map((filter) => ({
          name: filter,
          products: mockProducts
            .filter((product) => product.category === filter && !product.isDeal)
            .slice(0, 8)
            .map((product) => ({
              ...product,
              discountedPrice: product.discount
                ? calculateDiscountedPrice(product.price, product.discount)
                : null,
            })),
        }));

        const dealProducts = mockProducts
          .filter((product) => product.isDeal)
          .slice(0, 5)
          .map((product) => ({
            ...product,
            discount: `${product.discount}% OFF`,
            originalPrice: product.price,
            discountedPrice: calculateDiscountedPrice(product.price, product.discount),
          }));

        setCategories(groupedCategories);
        setDeals(dealProducts);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const activeProducts = categories.find((cat) => cat.name === activeCategory)?.products || [];

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
                Shop giao hàng khu vực nội thành và ngoại thành Hà Nội với mức ưu đãi đặc biệt
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
                Nếu khách hàng không hài lòng với sản phẩm shop sẽ thu xếp để đổi trả hoặc hoàn lại tiền theo mong muốn của khách hàng
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
                Han Florist luôn nỗ lực để mang lại những sản phẩm hoàn thiện nhất và tươi mới nhất đến tay khách hàng
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
            <Col key={deal.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
              <Card className="deal-card">
                <div className="deal-image-wrapper">
                  <Card.Img
                    variant="top"
                    src={deal.image}
                    alt={deal.title}
                    className="deal-image"
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
                    <span className="discounted-price">{deal.discountedPrice}</span>
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
                    className="bouquet-image"
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
                  <Card.Title className="bouquet-title">{bouquet.title}</Card.Title>
                  <Card.Text className="bouquet-price">
                    {bouquet.discount > 0 ? (
                      <>
                        <span className="original-price">{bouquet.price}</span>
                        <span className="discounted-price">{bouquet.discountedPrice}</span>
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
              <div className="quantity-selector d-flex align-items-center my-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <FaMinus />
                </Button>
                <span className="mx-3">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                >
                  <FaPlus />
                </Button>
              </div>
              <Button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                ADD TO CART
              </Button>
              <p className="mt-3">
                <strong>SKU:</strong> {selectedProduct?.sku}
              </p>
              <p>
                <strong>Categories:</strong> {selectedProduct?.categories?.join(", ")}
              </p>
              <Button variant="link" className="wishlist-button">
                <FaHeart /> Add to Wishlist
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MainContent;