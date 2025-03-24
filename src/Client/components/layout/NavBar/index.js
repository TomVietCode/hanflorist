import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { SlUser } from "react-icons/sl";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Dropdown,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";
import { useCart } from "../../../context/CartContext";

// Define menuItems outside the component and export it
export const menuItems = [
  {
    name: "BÓ HOA",
    links: [
      { label: "Hoa Hồng", path: "hoa-hong" },
      { label: "Hoa Ly", path: "hoa-ly" },
      { label: "Bó hoa Size S", path: "bo-hoa-size-s" },
      { label: "Bó hoa Size M", path: "bo-hoa-size-m" },
      { label: "Bó hoa Size L", path: "bo-hoa-size-l" },
    ],
  },
  {
    name: "GIỎ HOA",
    links: [
      { label: "Giỏ Hoa Tươi", path: "gio-hoa-tuoi" },
      { label: "Giỏ Hoa Đẹp", path: "gio-hoa-dep" },
    ],
  },
  {
    name: "WEDDING",
    links: [
      { label: "Hoa Cưới", path: "hoa-cuoi" },
      { label: "Hoa Cầm Tay", path: "hoa-cam-tay" },
      { label: "Combo Cưới", path: "combo-cuoi" },
    ],
  },
  {
    name: "BST CÁC SP KHÁC",
    links: [
      { label: "Hộp Hoa", path: "hop-hoa" },
      { label: "Lẵng Hoa", path: "lang-hoa" },
    ],
  },
  {
    name: "BST LOÀI HOA",
    links: [
      { label: "Hoa Lan", path: "hoa-lan" },
      { label: "Hoa Hướng Dương", path: "hoa-huong-duong" },
    ],
  },
];

function NavBar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { cart, removeFromCart } = useCart();
  let timeoutId = null;

  const handleMouseEnter = (index) => {
    if (timeoutId) clearTimeout(timeoutId);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setActiveDropdown(null), 200);
  };

  const handleNavigation = (category) => {
    setActiveDropdown(null);
    navigate(`/products/${category}`);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng giá tiền
  const totalPrice = cart.reduce((total, item) => {
    const price = item.discountedPrice
      ? parseFloat(item.discountedPrice.replace(/[^0-9]/g, ""))
      : parseFloat(item.price.replace(/[^0-9]/g, ""));
    return total + price * item.quantity;
  }, 0);

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="fixed-navbar">
        <Container>
          <Navbar.Brand href="/">HAN FLORIST</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menuItems.map((menu, index) => (
                <Dropdown
                  key={index}
                  show={activeDropdown === index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Dropdown.Toggle
                    as={Nav.Link}
                    onClick={() => handleNavigation(menu.links[0].path)}
                  >
                    {menu.name} <IoIosArrowDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    {menu.links.map((item, i) => (
                      <Dropdown.Item
                        key={i}
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ))}
            </Nav>

            <Form className="search-form">
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Tìm kiếm..."
                  aria-label="Tìm kiếm"
                />
                <Button variant="outline-secondary">
                  <FaSearch size={20} />
                </Button>
              </InputGroup>
            </Form>

            <div className="nav-icon" onClick={() => setShowCart(true)}>
              <HiOutlineShoppingBag className="cart-icon icon" />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </div>

            <div className="nav-icon" onClick={() => navigate("/user")}>
              <SlUser className="user-icon icon" />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Offcanvas */}
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Giỏ hàng</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="cart-offcanvas-body">
          <div className="cart-items-list">
            {cart.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item d-flex align-items-center mb-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-price">
                      {item.quantity} x {item.discountedPrice || item.price}
                    </p>
                  </div>
                  <Button
                    variant="link"
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <span>×</span>
                  </Button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Tổng tiền:</span>
                <span className="cart-total-price">{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-actions">
                <Button
                  className="cart-button"
                  onClick={() => {
                    setShowCart(false);
                    navigate("/cart");
                  }}
                >
                  XEM GIỎ HÀNG
                </Button>
                <Button
                  className="checkout-button"
                  onClick={() => {
                    setShowCart(false);
                    navigate("/checkout");
                  }}
                >
                  THANH TOÁN
                </Button>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;