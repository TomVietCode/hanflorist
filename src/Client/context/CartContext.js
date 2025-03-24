import React, { createContext, useState, useContext, useEffect } from "react";
import { getLocalStorage, setLocalStorage, deleteLocalStorage } from "../../share/hepler/localStorage";
import { get, post, patch, del } from "../../share/utils/http";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getLocalStorage("jwt_token"));
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(getLocalStorage("user_avatar") || null);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      const token = getLocalStorage("jwt_token");
      if (token) {
        setIsLoggedIn(true);
        await fetchCartFromDatabase(token);
      } else {
        setIsLoggedIn(false);
        let localCart = [];
        const cartData = getLocalStorage("cart");
        if (cartData) {
          try {
            localCart = JSON.parse(cartData) || [];
          } catch (error) {
            console.error("Error parsing local cart:", error);
            localCart = [];
            setLocalStorage("cart", JSON.stringify([]));
          }
        }
        setCart(localCart);
      }
      setIsLoading(false);
    };
    console.log("isLoggedIn:", isLoggedIn, "Token:", getLocalStorage("jwt_token"));
    initializeCart();

    const handleStorageChange = () => {
      const token = getLocalStorage("jwt_token");
      setIsLoggedIn(!!token);
      setAvatar(getLocalStorage("user_avatar") || null);
      if (token && !isLoggedIn) {
        setIsLoggedIn(true);
        let localCart = [];
        const cartData = getLocalStorage("cart");
        if (cartData) {
          try {
            localCart = JSON.parse(cartData) || [];
          } catch (error) {
            console.error("Error parsing local cart on storage change:", error);
            localCart = [];
            setLocalStorage("cart", JSON.stringify([]));
          }
        }
        if (localCart.length > 0) {
          syncLocalCartToDatabase(localCart, token);
        } else {
          fetchCartFromDatabase(token);
        }
      } else if (!token && isLoggedIn) {
        setIsLoggedIn(false);
        setCart([]);
        deleteLocalStorage("cart");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn]);

  const login = (token) => {
    setLocalStorage("jwt_token", token);
    setIsLoggedIn(true);
    const localCart = getLocalStorage("cart") ? JSON.parse(getLocalStorage("cart")) || [] : [];
    if (localCart.length > 0) {
      syncLocalCartToDatabase(localCart, token);
    } else {
      fetchCartFromDatabase(token);
    }
  };

  const syncLocalCartToDatabase = async (localCart, token) => {
    try {
      for (const item of localCart) {
        await post(token, "/api/cart", {
          productId: item.id,
          quantity: item.quantity,
        });
      }
      deleteLocalStorage("cart");
      await fetchCartFromDatabase(token);
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
    }
  };

  const fetchCartFromDatabase = async (token) => {
    try {
      const cartData = await get(token, "/api/cart");
      if (cartData && cartData.products) {
        setCart(
          cartData.products.map((item) => ({
            id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price.toString(),
            discountedPrice: item.productId.discountedPrice?.toString(),
            image: item.productId.image,
            quantity: item.quantity,
            subTotal: item.subTotal,
          }))
        );
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ database:", error);
      setCart([]);
    }
  };

  const saveCartToLocalStorage = (newCart) => {
    setLocalStorage("cart", JSON.stringify(newCart));
  };

  const saveCartToDatabase = async (product, quantity) => {
    const token = getLocalStorage("jwt_token");
    try {
      await post(token, "/api/cart", { productId: product.id, quantity });
      await fetchCartFromDatabase(token);
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào database:", error);
    }
  };

  const updateQuantityInDatabase = async (productId, newQuantity) => {
    const token = getLocalStorage("jwt_token");
    try {
      await patch(token, "/api/cart", { productId, quantity: newQuantity });
      await fetchCartFromDatabase(token);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng trong database:", error);
    }
  };

  const removeFromDatabase = async (productId) => {
    const token = getLocalStorage("jwt_token");
    try {
      await patch(token, "/api/cart", { productId, quantity: 0 });
      await fetchCartFromDatabase(token);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi database:", error);
    }
  };

  const clearCartInDatabase = async () => {
    const token = getLocalStorage("jwt_token");
    try {
      await del(token, "/api/cart");
      setCart([]);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng trong database:", error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    if (isLoggedIn) {
      saveCartToDatabase(product, quantity);
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        let newCart;
        if (existingItem) {
          newCart = prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...prevCart, { ...product, quantity }];
        }
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  };

  const removeFromCart = (productId) => {
    if (isLoggedIn) {
      removeFromDatabase(productId);
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.id !== productId);
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (isLoggedIn) {
      updateQuantityInDatabase(productId, newQuantity);
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  };

  const clearCart = () => {
    if (isLoggedIn) {
      clearCartInDatabase();
    } else {
      setCart([]);
      saveCartToLocalStorage([]);
    }
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemQuantity,
        isLoggedIn,
        isLoading,
        avatar,
        login,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);