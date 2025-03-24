// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, patch } from '../../share/utils/http';
import { getLocalStorage, setLocalStorage } from '../../share/hepler/localStorage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    products: [],
    totalAmount: 0,
  });

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = () => {
    return !!getLocalStorage('jwt_token');
  };

  // Lấy giỏ hàng từ localStorage
  const loadCartFromLocalStorage = () => {
    const savedCart = getLocalStorage('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
      return true; // Trả về true nếu có giỏ hàng trong localStorage
    }
    return false; // Trả về false nếu không có
  };

  // Lưu giỏ hàng vào localStorage
  const saveCartToLocalStorage = (newCart) => {
    setLocalStorage('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  // Lấy giỏ hàng từ backend
  const fetchCartFromBackend = async () => {
    try {
      const token = getLocalStorage('jwt_token');
      const response = await get(token, '/v1/carts');
      const cartData = response.data;
      console.log(cartData)
      setCart({
        products: cartData.products || [],
        totalAmount: cartData.totalAmount || 0,
      });
    } catch (error) {
      console.error('Error fetching cart from backend:', error);
      setCart({ products: [], totalAmount: 0 });
    }
  };

  const getCartItemQuantity = (productId) => {
    const cartItem = cart.products.find((item) => item.productId._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    const newCart = { ...cart };
    const { id: _id, stock, image: thumbnail, priceValue: price, title, discount: discountPercentage } = product;
    const existingProductIndex = newCart.products?.findIndex(
      (item) => item.productId._id === _id
    );

    if (existingProductIndex >= 0) {
      newCart.products[existingProductIndex].quantity += quantity;
      newCart.products[existingProductIndex].subTotal =
        newCart.products[existingProductIndex].quantity *
        (newCart.products[existingProductIndex].productId.price *
         (1 - newCart.products[existingProductIndex].productId.discountPercentage / 100));
    } else {
      const subTotal = quantity * (price * (1 - discountPercentage / 100));
      newCart.products?.push({
        productId: {
          _id: _id,
          title,
          price,
          stock,
          thumbnail,
          discountPercentage,
        },
        quantity,
        subTotal,
      });
    }

    newCart.totalAmount = newCart.products?.reduce(
      (sum, item) => sum + item.subTotal,
      0
    );

    if (isLoggedIn()) {
      updateCartOnBackend(newCart);
    } else {
      saveCartToLocalStorage(newCart);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    const newCart = { ...cart };
    newCart.products = newCart.products?.filter(
      (item) => item.productId._id !== productId
    );
    newCart.totalAmount = newCart.products?.reduce(
      (sum, item) => sum + item.subTotal,
      0
    );

    if (isLoggedIn()) {
      updateCartOnBackend(newCart);
    } else {
      saveCartToLocalStorage(newCart);
    }
  };

  const clearCart = async () => {
    const emptyCart = { products: [], totalAmount: 0 };
    if (isLoggedIn()) {
      try {
        const token = getLocalStorage('jwt_token');
        await patch(token, '/v1/cart', []); // Gửi mảng rỗng lên backend
        setCart(emptyCart);
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    } else {
      saveCartToLocalStorage(emptyCart);
    }
  };

  // Cập nhật giỏ hàng lên backend
  const updateCartOnBackend = async (newCart) => {
    try {
      const token = getLocalStorage('jwt_token');
      const payload = {
        products: newCart.products,
        totalAmount: newCart.totalAmount,
      };
      await patch(token, '/v1/carts', payload);
      setCart(newCart);
    } catch (error) {
      console.error('Error updating cart on backend:', error);
    }
  };

  // Đồng bộ giỏ hàng từ localStorage lên backend khi đăng nhập
  const syncCartOnLogin = () => {
    const localCart = getLocalStorage('cart');
    if (localCart && isLoggedIn()) {
      const parsedLocalCart = JSON.parse(localCart);
      updateCartOnBackend(parsedLocalCart);
    }
  };

  // Khởi tạo giỏ hàng khi component mount
  useEffect(() => {
    const hasLocalCart = loadCartFromLocalStorage(); 

    if (!hasLocalCart && isLoggedIn()) {
      fetchCartFromBackend(); // Nếu không có localStorage và đã đăng nhập, lấy từ backend
    }

    if(hasLocalCart && isLoggedIn()) {
      fetchCartFromBackend();
    }

    if (hasLocalCart && isLoggedIn()) {
      syncCartOnLogin(); // Nếu có localStorage và đã đăng nhập, đồng bộ lên backend
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};