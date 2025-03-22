import React from "react";
import { Card } from "react-bootstrap";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <Card className="product-card">
      <div className="product-image-wrapper">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      </div>
      <Card.Body>
        <Card.Title className="product-title">{product.title}</Card.Title>
        <Card.Text className="product-price">{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;