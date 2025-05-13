import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postPublic, post } from "../../../share/utils/http";
import { setLocalStorage, getLocalStorage } from "../../../share/hepler/localStorage";
import { FaGoogle } from "react-icons/fa";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    otp: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleLogin = () => {
    const currentDomain = window.location.origin;
    localStorage.setItem('frontendDomain', currentDomain);
    
    const baseUrl = process.env.REACT_APP_API_URL || 'https://hanflorist-be.onrender.com';
    window.location.href = `${baseUrl}/auth/google`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setLocalStorage("jwt_token", token);
      setSuccess("Đăng nhập bằng Google thành công!");
      setTimeout(() => {
        navigate("/");
        window.history.replaceState(null, "", window.location.pathname);
      }, 1000);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await postPublic("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      console.log("Login response:", response);

      if (response && response.data) {
        setLocalStorage("jwt_token", response.data);
        setSuccess("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await postPublic("/auth/signup", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        name: formData.name,
      });

      console.log("Register response:", response);
      console.log(response.status);

      // Kiểm tra status code thay vì chỉ dựa vào message
      if (response && response.data) {
        setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsLogin(true);
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Đăng ký thất bại");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await postPublic("/auth/forgot-password", {
        email: formData.email,
      });

      if (response.message === "OTP sent to email") {
        setSuccess("Mã OTP đã được gửi đến email của bạn!");
        setIsOtpModalOpen(true);
      } else {
        throw new Error("Gửi OTP thất bại");
      }
    } catch (err) {
      setError(err.message || "Gửi OTP thất bại");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await postPublic("/auth/otp-password", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.message === "OTP verified") {
        setSuccess("Xác thực OTP thành công! Vui lòng đặt lại mật khẩu.");
        setIsOtpModalOpen(false);
        setIsResetPasswordModalOpen(true);
      } else {
        throw new Error("Xác thực OTP thất bại");
      }
    } catch (err) {
      setError(err.message || "Xác thực OTP thất bại");
    }
  };

  const handleResetPassword = async () => {
    try {
      const token = getLocalStorage("jwt_token");
      const response = await post(token, "/auth/reset-password", {
        newPassword: formData.newPassword,
      });

      if (response.message === "Password reset successfully") {
        setSuccess("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        setIsResetPasswordModalOpen(false);
        setIsForgotPassword(false);
        setIsLogin(true);
      } else {
        throw new Error("Đặt lại mật khẩu thất bại");
      }
    } catch (err) {
      setError(err.message || "Đặt lại mật khẩu thất bại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isForgotPassword) {
      await handleForgotPassword();
    } else if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <Container className="login-page py-5">
      <Card className="login-card mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">
            {isForgotPassword ? "Quên Mật Khẩu" : isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && !isForgotPassword && (
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Họ Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {!isLogin && !isForgotPassword && (
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            {!isForgotPassword && (
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Mật Khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="w-100 mb-2">
              {isForgotPassword ? "Gửi OTP" : isLogin ? "Đăng Nhập" : "Đăng Ký"}
            </Button>
            {(isLogin || !isForgotPassword) && (
              <Button
                variant="outline-danger"
                className="w-100"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="me-2" />
                {isLogin ? "Đăng Nhập Bằng Google" : "Đăng Ký Bằng Google"}
              </Button>
            )}
          </Form>
          <div className="text-center mt-3">
            {isForgotPassword ? (
              <Button variant="link" onClick={() => setIsForgotPassword(false)}>
                Quay lại đăng nhập
              </Button>
            ) : (
              <>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setIsForgotPassword(false);
                  }}
                >
                  {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
                </Button>
                {isLogin && (
                  <Button
                    variant="link"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Quên mật khẩu?
                  </Button>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={isOtpModalOpen} onHide={() => setIsOtpModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nhập Mã OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
            <Form.Group className="mb-3" controlId="formOtp">
              <Form.Label>Mã OTP</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Xác Thực OTP
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={isResetPasswordModalOpen} onHide={() => setIsResetPasswordModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đặt Lại Mật Khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>Mật Khẩu Mới</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Đặt Lại Mật Khẩu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default LoginPage;