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
  {
    name: "BLOG",
    links: [
      { label: "Cách Chăm Hoa", path: "cham-hoa" },
      { label: "Ý Nghĩa Hoa", path: "y-nghia-hoa" },
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
                  placeholder="Search..."
                  aria-label="Search"
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
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item d-flex align-items-center mb-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                  <div className="cart-item-details flex-grow-1 mx-3">
                    <p className="mb-1">{item.title}</p>
                    <p className="mb-0">
                      {item.quantity} x {item.discountedPrice || item.price}
                    </p>
                  </div>
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <span>×</span>
                  </Button>
                </div>
              ))}
              <hr />
              <p className="text-end">
                HAN FLORIST xin chào, chúc bạn có một ngày mới vui vẻ
              </p>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;