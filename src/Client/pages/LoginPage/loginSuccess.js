import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLocalStorage } from '../../../share/hepler/localStorage';
import { get } from '../../../share/utils/http';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch cart data after login
  const fetchCartAfterLogin = async (token) => {
    try {
      // Fetch cart data from backend
      await get(token, '/v1/carts');
      console.log('Cart data fetched after login');
    } catch (error) {
      console.error('Error fetching cart after login:', error);
    }
  };

  useEffect(() => {
    // Lấy token từ URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      // Lưu token vào localStorage
      setLocalStorage('jwt_token', token);
      
      // Fetch cart data after login
      fetchCartAfterLogin(token);
      
      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('storage'));

      // Chuyển hướng về trang chủ sau khi xử lý token thành công
      navigate('/');
      
      // Xóa params khỏi URL để bảo mật
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default LoginSuccess;