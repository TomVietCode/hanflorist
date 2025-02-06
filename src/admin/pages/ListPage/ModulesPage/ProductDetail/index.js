import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dữ liệu sản phẩm theo ID
  const fetchProductById = async (productId) => {
    try {
      const response = await fetch(`/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  // Xử lý trạng thái loading và lỗi
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{product?.title}</h1>
    </div>
  );
};

export default ProductDetail;
