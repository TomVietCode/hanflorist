import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import './CartPage.css';

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Tính tổng tiền trước giảm giá
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice
        ? parseFloat(item.discountedPrice.replace(/[^0-9]/g, ""))
        : parseFloat(item.price.replace(/[^0-9]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  // Áp dụng mã giảm giá
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "DISCOUNT10") {
      setDiscount(0.1); // Giảm 10%
      alert("Áp dụng mã giảm giá thành công!");
    } else {
      setDiscount(0);
      alert("Mã giảm giá không hợp lệ!");
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * discount;
  const totalPrice = subtotal - discountAmount;

  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

  // Xử lý tăng/giảm số lượng
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Container className="cart-page py-5">
      <h1 className="cart-title">Giỏ hàng</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <Table responsive className="cart-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-image"
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.discountedPrice || item.price}</td>
                  <td>
                    <div className="quantity-selector">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="quantity">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>
                    {formatPrice(
                      (item.discountedPrice
                        ? parseFloat(item.discountedPrice.replace(/[^0-9]/g, ""))
                        : parseFloat(item.price.replace(/[^0-9]/g, ""))) *
                        item.quantity
                    )}
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="cart-summary mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mã giảm giá</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="coupon-input"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button className="apply-coupon-button" onClick={applyCoupon}>
                    Áp dụng mã giảm giá
                  </Button>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="cart-totals">
                <h4>Tổng giỏ hàng</h4>
                <div className="totals-row">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="totals-row">
                  <span>Giảm giá</span>
                  <span>{formatPrice(discountAmount)}</span>
                </div>
                <div className="totals-row total">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Button
                  className="update-cart-button"
                  onClick={() => alert("Giỏ hàng đã được cập nhật!")}
                >
                  CẬP NHẬT GIỎ HÀNG
                </Button>
                <Button
                  className="proceed-checkout-button"
                  onClick={() => navigate("/checkout")}
                >
                  TIẾP TỤC THANH TOÁN
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default CartPage;