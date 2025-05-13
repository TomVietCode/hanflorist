// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, patch, post, del } from '../../share/utils/http';
import { getLocalStorage, setLocalStorage, deleteLocalStorage } from '../../share/hepler/localStorage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    products: [],
    totalAmount: 0,
  });
  const [avatar, setAvatar] = useState(null);
  const [loginState, setLoginState] = useState(() => !!getLocalStorage('jwt_token'));

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = () => {
    return !!getLocalStorage('jwt_token');
  };

  // Lấy thông tin avatar của người dùng
  const fetchUserAvatar = async () => {
    if (isLoggedIn()) {
      try {
        const token = getLocalStorage('jwt_token');
        const storedAvatar = getLocalStorage('user_avatar');
        
        if (storedAvatar) {
          setAvatar(storedAvatar);
        } else {
          const response = await get(token, '/users/v1/profile');
          if (response && response.data && response.data.avatar) {
            setAvatar(response.data.avatar);
            setLocalStorage('user_avatar', response.data.avatar);
          }
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    } else {
      setAvatar(null);
    }
  };

  // Lấy giỏ hàng từ localStorage
  const loadCartFromLocalStorage = () => {
    const savedCart = getLocalStorage('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        return true;
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return false;
      }
    }
    return false;
  };

  // Lưu giỏ hàng vào localStorage
  const saveCartToLocalStorage = (newCart) => {
    setLocalStorage('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  // Lấy giỏ hàng từ backend
  const fetchCartFromBackend = async () => {
    if (!isLoggedIn()) return false;
    
    try {
      const token = getLocalStorage('jwt_token');
      const response = await get(token, '/v1/carts');
      const cartData = response.data;
      
      if (cartData) {
        setCart({
          products: cartData.products || [],
          totalAmount: cartData.totalAmount || 0,
        });
        return cartData.products && cartData.products.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error fetching cart from backend:', error);
      return false;
    }
  };

  const getCartItemQuantity = (productId) => {
    if (!cart || !cart.products) return 0;
    const cartItem = cart.products.find((item) => item.productId._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product, quantity = 1) => {
    // For logged-out users, use localStorage
    if (!isLoggedIn()) {
      const newCart = { ...cart };
      
      // Ensure products array exists
      if (!newCart.products) {
        newCart.products = [];
      }
      
      const { id: _id, stock, image: thumbnail, priceValue: price, title, discount: discountPercentage } = product;
      const existingProductIndex = newCart.products.findIndex(
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
        newCart.products.push({
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

      newCart.totalAmount = newCart.products.reduce(
        (sum, item) => sum + item.subTotal,
        0
      );
      
      saveCartToLocalStorage(newCart);
      return;
    }
    
    // For logged-in users, use backend API
    try {
      const token = getLocalStorage('jwt_token');
      const { id: productId } = product;
      
      // Send request to backend
      const response = await post(token, '/v1/carts', {
        productId,
        quantity
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Refetch cart to ensure up-to-date data
      await fetchCartFromBackend();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItemQuantity = async (productId, newQuantity) => {
    // For logged-out users, use localStorage
    if (!isLoggedIn()) {
      if (!cart.products) return;
      
      const newCart = { ...cart };
      const productIndex = newCart.products.findIndex(
        (item) => item.productId._id === productId
      );
      
      if (productIndex !== -1) {
        newCart.products[productIndex].quantity = newQuantity;
        newCart.products[productIndex].subTotal = 
          newQuantity * newCart.products[productIndex].productId.price *
          (1 - newCart.products[productIndex].productId.discountPercentage / 100);
        
        // Tính lại tổng giá trị giỏ hàng
        newCart.totalAmount = newCart.products.reduce(
          (sum, item) => sum + item.subTotal,
          0
        );
        
        saveCartToLocalStorage(newCart);
      }
      return;
    }
    
    // For logged-in users, use backend API
    try {
      const token = getLocalStorage('jwt_token');
      
      // Send array of updates (backend API expects an array)
      const response = await patch(token, '/v1/carts', [
        { productId, quantity: newQuantity }
      ]);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Refetch cart to ensure up-to-date data
      await fetchCartFromBackend();
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    // For logged-out users, use localStorage
    if (!isLoggedIn()) {
      const newCart = { ...cart };
      if (!newCart.products) {
        newCart.products = [];
        newCart.totalAmount = 0;
        return;
      }
      
      newCart.products = newCart.products.filter(
        (item) => item.productId._id !== productId
      );
      newCart.totalAmount = newCart.products.reduce(
        (sum, item) => sum + item.subTotal,
        0
      );
      
      saveCartToLocalStorage(newCart);
      return;
    }
    
    // For logged-in users, use backend API
    try {
      const token = getLocalStorage('jwt_token');
      
      // Handle the DELETE request properly
      const response = await fetch(`${process.env.REACT_APP_API_URL || "https://hanflorist-be.onrender.com"}/v1/carts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refetch cart to ensure up-to-date data
      await fetchCartFromBackend();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const clearCart = async () => {
    const emptyCart = { products: [], totalAmount: 0 };
    
    if (isLoggedIn()) {
      try {
        const token = getLocalStorage('jwt_token');
        
        // Clear all items from cart
        await patch(token, '/v1/carts', []);
        setCart(emptyCart);
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    } else {
      saveCartToLocalStorage(emptyCart);
    }
  };

  // Cập nhật toàn bộ giỏ hàng lên backend (chỉ dùng khi đồng bộ)
  const updateCartOnBackend = async (localCart) => {
    if (!isLoggedIn() || !localCart.products || localCart.products.length === 0) return;
    
    try {
      const token = getLocalStorage('jwt_token');
      
      // For each product in the local cart, add it to the backend cart one by one
      for (const item of localCart.products) {
        await post(token, '/v1/carts', {
          productId: item.productId._id,
          quantity: item.quantity
        });
      }
      
      // Fetch updated cart from backend
      await fetchCartFromBackend();
      console.log("Cart synced with backend successfully");
    } catch (error) {
      console.error('Error updating cart on backend:', error);
    }
  };

  // Xử lý khi đăng nhập: chuyển giỏ hàng từ localStorage lên database nếu giỏ hàng database trống
  const handleLogin = async () => {
    try {
      // 1. Fetch cart from backend first
      const hasCartInBackend = await fetchCartFromBackend();
      
      // 2. Check if there's a cart in localStorage
      const localCartString = getLocalStorage('cart');
      if (!localCartString) return;
      
      // 3. If backend cart is empty and localStorage cart exists
      if (!hasCartInBackend) {
        const localCart = JSON.parse(localCartString);
        if (localCart.products && localCart.products.length > 0) {
          // 4. Update backend cart with localStorage cart
          await updateCartOnBackend(localCart);
          console.log("Synced localStorage cart to backend");
        }
      }
      
      // 5. Clear localStorage cart after syncing
      deleteLocalStorage('cart');
    } catch (error) {
      console.error('Error handling login cart sync:', error);
    }
  };

  // Kiểm tra sự thay đổi trạng thái đăng nhập
  const checkLoginState = () => {
    const currentLoginState = isLoggedIn();
    
    // Nếu trạng thái đăng nhập thay đổi
    if (loginState !== currentLoginState) {
      console.log("Login state changed:", currentLoginState ? "Logged In" : "Logged Out");
      setLoginState(currentLoginState);
      
      // Nếu vừa đăng nhập
      if (currentLoginState) {
        handleLogin();
      } else {
        // Nếu vừa đăng xuất, tải giỏ hàng từ localStorage
        loadCartFromLocalStorage();
      }
    }
  };

  // Khởi tạo lần đầu và theo dõi trạng thái đăng nhập
  useEffect(() => {
    // Khởi tạo lần đầu: nếu đang đăng nhập thì lấy giỏ hàng từ database, ngược lại từ localStorage
    const initCart = async () => {
      if (isLoggedIn()) {
        console.log("Initial load: User is logged in, fetching cart from backend");
        await fetchCartFromBackend();
      } else {
        console.log("Initial load: User is not logged in, loading cart from localStorage");
        loadCartFromLocalStorage();
      }
    };
    
    // Fetch user data and init cart
    fetchUserAvatar();
    initCart();
    
    // Thiết lập kiểm tra định kỳ trạng thái đăng nhập
    const loginCheckInterval = setInterval(checkLoginState, 1000);
    
    // Lắng nghe sự kiện storage để phát hiện thay đổi token
    const handleStorageChange = (event) => {
      if (event.key === 'jwt_token') {
        checkLoginState();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      clearInterval(loginCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getCartItemQuantity,
        isLoggedIn: loginState,
        avatar,
        refreshUserData: fetchUserAvatar
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};