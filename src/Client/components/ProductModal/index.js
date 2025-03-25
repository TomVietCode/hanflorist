import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { get } from "../../../share/utils/http";
import "./ProductModal.css";

function ProductModal({
  showModal,
  handleCloseModal,
  selectedProduct,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  getCartItemQuantity,
}) {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxQuantity =
    selectedProduct?.stock - (getCartItemQuantity(selectedProduct?.id) || 0);

  // Gọi API để lấy thông tin chi tiết sản phẩm
  useEffect(() => {
    if (selectedProduct?.slug) {
      const fetchProductDetails = async () => {
        try {
          setLoading(true);
          const response = await get(
            "",
            `/v1/products/${selectedProduct.slug}`
          );
          if (!response) {
            throw new Error("Không thể lấy thông tin sản phẩm");
          }
          setProductDetails(response);
        } catch (err) {
          setError(err.message || "Không thể tải thông tin sản phẩm");
        } finally {
          setLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="align-items-start">
          <Col md={4} className="product-modal-image-col">
            <div className="product-modal-image-container">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="product-modal-image"
              />
            </div>
          </Col>
          <Col md={8} className="product-modal-info-col">
            <h4 className="product-modal-price">
              {selectedProduct?.discountedPrice || selectedProduct?.price}
            </h4>
            {loading ? (
              <p>Đang tải thông tin...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                <p>
                  <strong>Số lượng còn lại:</strong> {selectedProduct.stock}
                </p>
                <p>
                  <strong>Số lượng trong giỏ hàng:</strong>{" "}
                  {getCartItemQuantity(selectedProduct.id) || 0}
                </p>
                <p>
                  <strong>Số lượng tối đa có thể thêm:</strong> {maxQuantity}
                </p>
              </>
            )}
            <div className="d-flex align-items-center">
              <div className="quantity-selector d-flex align-items-center my-3">
                <Button
                  // variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </Button>
                <span className="mx-3">{quantity}</span>
                <Button
                  // variant="outline-secondary"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                >
                  <FaPlus />
                </Button>
              </div>
              <Button
                className="add-to-cart-button w-100"
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={quantity === 0 || maxQuantity <= 0}
              >
                ADD TO CART
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ProductModal;
