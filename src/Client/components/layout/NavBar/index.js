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
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NavBar.css";
import { deleteLocalStorage } from "../../../../share/hepler/localStorage";
import { useCart } from "../../../context/CartContext";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import { getPublic } from "../../../../share/utils/http";

function NavBar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái cho ô tìm kiếm
  const { cart, removeFromCart, isLoggedIn, avatar, refreshUserData } = useCart();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  let timeoutId = null;

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPublic("/v1/categories");
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Dữ liệu danh mục không phải là mảng");
        }
      } catch (err) {
        setError(err.message || "Không thể lấy danh sách danh mục");
      }
    };

    fetchCategories();
  }, []);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const handleMouseEnter = (index) => {
    if (timeoutId) clearTimeout(timeoutId);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setActiveDropdown(null), 200);
  };

  const handleNavigation = (slug) => {
    setActiveDropdown(null);
    navigate(`/categories/${slug}`);
  };

  // Xử lý điều hướng đến danh mục cha
  const handleParentNavigation = (menu) => {
    setActiveDropdown(null);
    // Đảm bảo chúng ta luôn sử dụng slug của danh mục cha
    navigate(`/categories/${menu.slug}`);
  };

  const handleLogout = () => {
    deleteLocalStorage("jwt_token");
    deleteLocalStorage("user_avatar");
    window.location.reload(); // Reload để cập nhật trạng thái đăng nhập
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    // Tạo query parameters cho tìm kiếm
    const queryParams = new URLSearchParams({
      keyword: searchQuery,
      page: 1,
      limit: 10, // Mặc định 10 sản phẩm mỗi trang
    });

    // Điều hướng đến trang kết quả tìm kiếm với query parameters
    navigate(`/search?${queryParams.toString()}`);
  };

  const totalItems = cart.products?.reduce((total, item) => total + item.quantity, 0) || 0;
  const totalPrice = cart.totalAmount || 0;

  const formatPrice = (price) => {
    return `${price?.toLocaleString("vi-VN")} đ`;
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="fixed-navbar">
        <Container>
          <Navbar.Brand href="/">HAN FLORIST</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {categories.length > 0 ? (
                categories.map((menu, index) => (
                  <Dropdown
                    key={menu._id}
                    show={activeDropdown === index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Dropdown.Toggle
                      as={Nav.Link}
                      onClick={() => handleParentNavigation(menu)}
                    >
                      {menu.title} <IoIosArrowDown />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                      {menu.children && menu.children.length > 0 ? (
                        menu.children.map((child) => (
                          <Dropdown.Item
                            className="dropdown-item-fixx"
                            key={child._id}
                            onClick={() => handleNavigation(child.slug)}
                          >
                            {child.title}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>Không có danh mục con</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                ))
              ) : (
                <Nav.Link disabled>Đang tải danh mục...</Nav.Link>
              )}
            </Nav>

            <Form className="search-form d-flex mx-auto" onSubmit={handleSearch}>
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Tìm kiếm..."
                  aria-label="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
                <Button variant="outline-secondary" type="submit">
                  <FaSearch size={20} />
                </Button>
              </InputGroup>
            </Form>

            <div className="d-flex align-items-center">
              <div className="nav-icon" onClick={() => setShowCart(true)}>
                <HiOutlineShoppingBag className="cart-icon icon" />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </div>

              <Dropdown className="nav-icon">
                <Dropdown.Toggle as="div" className="user-icon">
                  {isLoggedIn && avatar ? (
                    <Image
                      src={avatar}
                      roundedCircle
                      width={24}
                      height={24}
                      alt="User Avatar"
                      className="user-avatar"
                    />
                  ) : (
                    <SlUser className="user-icon icon" />
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="custom-dropdown-menu">
                  {isLoggedIn ? (
                    <>
                      <Dropdown.Item onClick={() => navigate("/profile")}>
                        Chỉnh Sửa Thông Tin
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate("/change-password")}>
                        Đổi Mật Khẩu
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>Đăng Xuất</Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item onClick={() => navigate("/login")}>
                      Đăng Nhập
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
            {!cart.products || cart.products.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
              cart.products?.map((item) => (
                <div
                  key={item.productId._id}
                  className="cart-item d-flex align-items-center mb-3"
                >
                  <img
                    src={item.productId.thumbnail}
                    alt={item.productId.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <p className="cart-item-title">{item.productId.title}</p>
                    <p className="cart-item-price">
                      {item.quantity} x {item.discountedPrice || item.price}
                    </p>
                  </div>
                  <Button
                    variant="link"
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    <span>×</span>
                  </Button>
                </div>
              ))
            )}
          </div>
          {cart.products && cart.products.length > 0 && (
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