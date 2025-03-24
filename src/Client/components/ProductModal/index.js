import React from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./ProductModal.css"; // File CSS mới cho modal

function ProductModal({
  showModal,
  handleCloseModal,
  selectedProduct,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  getCartItemQuantity,
}) {
  const maxQuantity =
    selectedProduct?.stock - (getCartItemQuantity(selectedProduct?.id) || 0);

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6} className="product-modal-image-container">
            <img
              src={selectedProduct?.image}
              alt={selectedProduct?.title}
              className="product-modal-image"
            />
          </Col>
          <Col md={6}>
            <h4>
              {selectedProduct?.discountedPrice || selectedProduct?.price}
            </h4>
            <p>
              <strong>SKU:</strong> {selectedProduct?.id}
            </p>
            <p>
              <strong>Categories:</strong> {selectedProduct?.category || "Hoa cưới, Hoa cầm tay"}
            </p>
            <p>
              <strong>Số lượng còn lại:</strong> {selectedProduct?.stock}
            </p>
            <p>
              <strong>Số lượng trong giỏ hàng:</strong>{" "}
              {getCartItemQuantity(selectedProduct?.id) || 0}
            </p>
            <p>
              <strong>Số lượng tối đa có thể thêm:</strong> {maxQuantity}
            </p>
            <div className="quantity-selector d-flex align-items-center my-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </Button>
              <span className="mx-3">{quantity}</span>
              <Button
                variant="outline-secondary"
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
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ProductModal;