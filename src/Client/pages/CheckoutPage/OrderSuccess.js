// src/pages/client/OrderSuccess.js
import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { get } from "../../../share/utils/http";
import "./OrderSuccess.css";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin đơn hàng từ API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("jwt_token") || "";
        const response = await get(token, `/v1/orders/${orderId}`);
        setOrder(response.data.order); // Truy cập vào "data.order"
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

  if (loading) {
    return (
      <Container className="order-success py-5 text-center">
        <h1 className="success-title">Đặt hàng thành công!</h1>
        <p>Đang tải thông tin đơn hàng...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="order-success py-5 text-center">
        <h1 className="success-title">Đặt hàng thành công!</h1>
        <p>{error}</p>
        <Button variant="primary" onClick={handleBackToHome} className="mt-3">
          Quay về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container className="order-success py-5">
      <h1 className="success-title text-center">Đặt hàng thành công!</h1>
      <p className="text-center">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>
      {order ? (
        <>
          <p className="text-center">
            Mã đơn hàng của bạn là: <strong>{order.orderCode}</strong>. Vui lòng ghi nhớ mã này để theo dõi đơn hàng.
          </p>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Chi tiết đơn hàng</Card.Title>
              <div className="order-items">
                {order.items?.map((item) => (
                  <div key={item._id} className="d-flex mb-3">
                    <img
                      src={item.productId.thumbnail}
                      alt={item.productId.title}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      className="me-3"
                    />
                    <div className="flex-grow-1">
                      <p><strong>{item.productId.title}</strong></p>
                      <p>Số lượng: {item.quantity}</p>
                      <p>Tạm tính: {formatPrice(item.subTotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="order-summary">
                <p><strong>Tổng tiền hàng:</strong> {formatPrice(order.totalAmount)}</p>
                <p>
                  <strong>Phí vận chuyển:</strong>{" "}
                  {order.deliveryMethod === "pickup" ? "Miễn phí" : formatPrice(30000)}
                </p>
                <p>
                  <strong>Tổng thanh toán:</strong>{" "}
                  {formatPrice(order.totalAmount + (order.deliveryMethod === "pickup" ? 0 : 30000))}
                </p>
                <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                <p><strong>Thông tin giao hàng:</strong> {order.shippingInfo.address}</p>
                <p>
                  <strong>Người nhận:</strong> {order.shippingInfo.name} - {order.shippingInfo.phone}
                  {order.shippingInfo.email && ` - ${order.shippingInfo.email}`}
                </p>
                <p><strong>Ngày giao:</strong> {new Date(order.deliveryDate).toLocaleDateString("vi-VN")}</p>
                <p><strong>Trạng thái:</strong> {order.status === "pending" ? "Đang xử lý" : order.status}</p>
                <p><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p className="text-center">Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất!</p>
      )}
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleBackToHome}>
          Quay về trang chủ
        </Button>
      </div>
    </Container>
  );
}

export default OrderSuccess;