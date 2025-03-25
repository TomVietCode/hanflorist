import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { get } from "../../../share/utils/http";
import "./ProductDetailPage.css";
import { useCart } from "../../context/CartContext";

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartItemQuantity } = useCart(); // Sử dụng useCart

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await get("", `/v1/products/${slug}`);

        if (!response) {
          throw new Error("Không thể lấy thông tin sản phẩm");
        }
        setProduct(response.data);
        console.log("product:", response.data);
      } catch (err) {
        setError(err.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const currentInCart = getCartItemQuantity(product?._id) || 0;
      const maxQuantity = (product?.stock || 0) - currentInCart;

      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const currentInCart = getCartItemQuantity(product._id) || 0;
    const totalQuantity = currentInCart + quantity;

    if (totalQuantity > product.stock) {
      alert(
        `Không thể thêm vào giỏ hàng! Tổng số lượng (${totalQuantity}) vượt quá số lượng còn lại (${product.stock}).`
      );
      return;
    }

    addToCart(
      {
        id: product._id,
        title: product.title,
        price: Number(product.price), // Đảm bảo price là số
        image: product.thumbnail,
        stock: product.stock,
      },
      quantity
    );
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const currentInCart = getCartItemQuantity(product._id) || 0;
  const maxQuantity = (product.stock || 0) - currentInCart;

  return (
    <Container className="product-detail-page">
      <Row>
        <Col md={6}>
          <div className="product-detail-image-container">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-detail-image"
            />
          </div>
        </Col>
        <Col md={6} className="product-detail-info">
          <h2 className="product-detail-title">{product.title}</h2>
          <h4 className="product-detail-price">
            {product.price
              ? `${product.price.toLocaleString("vi-VN")} đ`
              : "Giá không khả dụng"}
          </h4>
          <p>
            <strong>Categories:</strong>{" "}
            {product.categoryId?.title || "Hoa cưới, Hoa cầm tay"}
          </p>
          <p>
            <strong>Số lượng còn lại:</strong> {product.stock || 0}
          </p>
          <p>
            <strong>Số lượng trong giỏ hàng:</strong> {currentInCart}
          </p>
          <p>
            <strong>Số lượng tối đa có thể thêm:</strong> {maxQuantity}
          </p>
          <div className="d-flex">
            <div className="quantity-selector">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
              >
                +
              </Button>
            </div>
            <Button className="add-to-cart-button" onClick={handleAddToCart}>
              ADD TO CART
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
