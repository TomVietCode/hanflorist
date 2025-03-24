import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { get } from '../../../share/utils/http';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy token từ URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem('jwt_token', token);

      // Verify token với backend
      get("token", '/v1/profile')
      .then(response => {
        console.log('User info:', response.data);
        navigate('/');
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        navigate('/login');
      });
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default LoginSuccess;