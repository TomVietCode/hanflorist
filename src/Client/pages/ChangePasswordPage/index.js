import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { post } from "../../../share/utils/http";
import { getLocalStorage } from "../../../share/hepler/localStorage";
import "./ChangePasswordPage.css";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = getLocalStorage("jwt_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await post(token, "/auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.message === "Password changed successfully") {
        setSuccess("Đổi mật khẩu thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error("Đổi mật khẩu thất bại");
      }
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <Container className="change-password-page py-5">
      <Card className="change-password-card mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">Đổi Mật Khẩu</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formOldPassword">
              <Form.Label>Mật Khẩu Cũ</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
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
              Đổi Mật Khẩu
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ChangePasswordPage;