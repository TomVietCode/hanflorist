import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Rating, Grid } from '@mui/material';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Giả sử có API để lấy thông tin sản phẩm theo productId
    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            alt={product.name}
            height="300"
            image={product.imageUrl}
            title={product.name}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.description}
            </Typography>
            <Typography variant="h6" color="primary">
              ${product.price}
            </Typography>
            <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography sx={{ ml: 1 }}>{product.rating}</Typography>
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
