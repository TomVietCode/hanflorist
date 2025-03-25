// src/pages/client/CheckoutPage.js
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import vietnamLocations from "../../../share/vietnamLocations";
import { postPublic } from "../../../share/utils/http";
import { useCart } from "../../context/CartContext";

function CheckoutPage() {
  const { cart, clearCart } = useCart(); // clearCart nếu có trong CartContext
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    receiverName: "",
    receiverPhone: "",
    receiverType: "self",
    receiveAtStore: false,
    deliveryDate: "",
    district: "",
    city: "",
    paymentMethod: "COD",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "city" ? { district: "" } : {}),
    }));
  };

  const totalPayment = cart.totalAmount;

  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Chuẩn bị dữ liệu gửi lên backend
    const orderData = {
      cart: {
        products: cart.products.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          subTotal: item.subTotal
        })),
        totalAmount: cart.totalAmount || 1
      },
      shippingInfo: {
        name: formData.fullName ,
        email: formData.email,
        phone: formData.phone ,
        address: formData.receiveAtStore
          ? "Nhận tại cửa hàng"
          : `${formData.district}, ${formData.city}`,
      },
      paymentMethod: formData.paymentMethod, // COD hoặc QR
      recipientType: formData.receiverType,
      deliveryDate: new Date(formData.deliveryDate).toISOString(),
      deliveryMethod: formData.receiveAtStore ? "pickup" : "delivery",
    };
    try {
      const response = await postPublic('/v1/orders', orderData);
      const data = response?.data
      clearCart(); 
      window.location.href = data?.paymentUrl
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="checkout-page py-5">
        <h1 className="checkout-title">Thông tin đặt hàng</h1>
        <p>Đang xử lý đơn hàng...</p>
      </Container>
    );
  }

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
              <Form.Label>Email người đặt hoa</Form.Label>
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
              <Form.Label>Nhận tại cửa hàng/Giao đến địa chỉ</Form.Label>
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
                <option value="delivery">Giao đến địa chỉ</option>
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
                            <option key={district.value} value={district.value}>
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
                label="Thanh toán khi nhận hàng (COD)"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === "COD"}
                onChange={handleInputChange}
              />
              <Form.Check
                type="radio"
                label="Thanh toán online"
                name="paymentMethod"
                value="VNPay"
                checked={formData.paymentMethod === "VNPay"}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button type="submit" className="place-order-button" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h1 className="order-title">Đơn hàng của bạn</h1>
          <div className="order-summary">
            <div className="order-items">
              {cart.products?.length === 0 ? (
                <p>Đơn hàng của bạn đang trống.</p>
              ) : (
                cart.products?.map((item) => (
                  <div key={item.productId._id} className="order-item d-flex mb-3">
                    <img
                      src={item.productId.thumbnail}
                      alt={item.productId.title}
                      className="order-item-image"
                    />
                    <div className="order-item-details flex-grow-1">
                      <p>{item.productId.title}</p>
                      <p className="order-item-code">Mã sản phẩm: {item.productId._id}</p>
                      <p>
                        Số lượng: {item.quantity} x{" "}
                        {formatPrice(item.productId.price * (1 - item.productId.discountPercentage / 100))}
                      </p>
                    </div>
                    <div className="order-item-total">
                      {formatPrice(item.subTotal)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="order-totals">
              <div className="totals-row">
                <span>Tổng cộng</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="totals-row">
                <span>Phí vận chuyển</span>
                <span>{"Miễn phí"}</span>
              </div>
              <div className="totals-row total">
                <span>Tổng thanh toán</span>
                <span>{formatPrice(totalPayment)}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;