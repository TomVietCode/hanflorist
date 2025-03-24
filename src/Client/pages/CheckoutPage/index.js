import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import vietnamLocations from "../../../share/vietnamLocations";

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    receiverName: "",
    receiverPhone: "",
    receiverType: "self", // "self" hoặc "other"
    receiveAtStore: false,
    deliveryDate: "",
    district: "",
    city: "",
    paymentMethod: "cod",
    note: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "city" ? { district: "" } : {}), // Reset district when city changes
    }));
  };

  // Tính tổng tiền trước phí vận chuyển
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice
        ? parseFloat(item.discountedPrice.replace(/[^0-9]/g, ""))
        : parseFloat(item.price.replace(/[^0-9]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  // Tính phí vận chuyển
  const calculateShippingFee = () => {
    if (formData.receiveAtStore) return 0;
    if (!formData.city) return 0;
    if (formData.city === "Hà Nội" || formData.city === "TP Hồ Chí Minh") {
      return 30000; // 30.000 đ cho Hà Nội và TP.HCM
    }
    return 50000; // 50.000 đ cho các tỉnh khác
  };

  const subtotal = calculateSubtotal();
  const shippingFee = calculateShippingFee();
  const totalPrice = subtotal + shippingFee;
  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đơn hàng đã được đặt thành công!");
    clearCart(); // Xóa giỏ hàng
    navigate("/"); // Chuyển hướng về trang chủ
  };

  return (
    <Container className="checkout-page py-5">
      <Row>
        <Col md={6}>
          <h1 className="checkout-title">Thông tin đặt hàng</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên người đặt hoa</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nguyễn Việt Anh"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Email người đặt hoa (chúng tôi sẽ gửi mail)
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email của bạn"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tôi là người nhận/Người khác nhận hoa</Form.Label>
              <Form.Select
                name="receiverType"
                value={formData.receiverType}
                onChange={handleInputChange}
                required
              >
                <option value="self">Tôi là người nhận</option>
                <option value="other">Người khác nhận hoa</option>
              </Form.Select>
            </Form.Group>

            {formData.receiverType === "other" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên người nhận</Form.Label>
                  <Form.Control
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleInputChange}
                    placeholder="Họ tên người nhận"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại người nhận</Form.Label>
                  <Form.Control
                    type="text"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại người nhận"
                    required
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại người đặt hoa</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="090492973"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nhận tại cửa hàng/Giao đến địa chỉ cửa tiệm</Form.Label>
              <Form.Select
                name="receiveAtStore"
                value={formData.receiveAtStore ? "store" : "delivery"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    receiveAtStore: e.target.value === "store",
                    city: e.target.value === "store" ? "" : formData.city,
                    district: e.target.value === "store" ? "" : formData.district,
                  })
                }
              >
                <option value="store">Nhận tại cửa hàng</option>
                <option value="delivery">Giao đến địa chỉ cửa tiệm</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chọn ngày giao hoa</Form.Label>
              <Form.Control
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {!formData.receiveAtStore && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quận/Huyện</Form.Label>
                    <Form.Select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {formData.city &&
                        vietnamLocations.districts[formData.city]?.map(
                          (district) => (
                            <option
                              key={district.value}
                              value={district.value}
                            >
                              {district.label}
                            </option>
                          )
                        )}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh/Thành phố</Form.Label>
                    <Form.Select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {vietnamLocations.cities.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Kỷ niệm có thể là lý do nhắn nhủ đến người được tặng..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="radio"
                label="Đặt có vận chuyển (COD/Đóng đúng dung lệ 8.3)"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleInputChange}
              />
              <Form.Check
                type="radio"
                label="Thanh toán Chuyển khoản bằng QR"
                name="paymentMethod"
                value="qr"
                checked={formData.paymentMethod === "qr"}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button type="submit" className="place-order-button">
              ĐẶT HÀNG
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h1 className="order-title">Đơn hàng của bạn</h1>
          <div className="order-summary">
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item d-flex mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="order-item-image"
                  />
                  <div className="order-item-details flex-grow-1">
                    <p>{item.title}</p>
                    <p className="order-item-code">xrkvk35</p>
                  </div>
                  <div className="order-item-total">
                    {formatPrice(
                      (item.discountedPrice
                        ? parseFloat(item.discountedPrice.replace(/[^0-9]/g, ""))
                        : parseFloat(item.price.replace(/[^0-9]/g, ""))) *
                        item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="totals-row">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="totals-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
              </div>
              <div className="totals-row total">
                <span>Tổng thanh toán</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;