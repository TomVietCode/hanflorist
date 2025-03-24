import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get } from "../../../share/utils/http";
import { getLocalStorage, setLocalStorage, deleteLocalStorage } from "../../../share/hepler/localStorage";
import "./ProfilePage.css";
import { useCart } from "../../context/CartContext";

function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useCart();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_DOMAIN = "http://localhost:3001";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getLocalStorage("jwt_token");
      if (!token) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      setLoading(true);
      try {
        const response = await get(token, "/v1/users/profile");
        if (response.data) {
          setUser(response.data);
          setFormData({
            name: response.data.name || "",
            avatar: null,
          });
          setPreviewAvatar(response.data.avatar || null);
          setLocalStorage("user_avatar", response.data.avatar || "");
        } else {
          throw new Error("Không thể lấy thông tin người dùng");
        }
      } catch (err) {
        if (err.message.includes("401")) {
          deleteLocalStorage("jwt_token");
          deleteLocalStorage("user_avatar");
          navigate("/login");
          setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        } else {
          setError(err.message || "Không thể lấy thông tin người dùng");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const customPatch = async (token, path, data) => {
    const response = await fetch(API_DOMAIN + path, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Không có thông tin lỗi"}`
        );
      } else {
        const text = await response.text();
        throw new Error(
          `Phản hồi không phải JSON (Status: ${response.status}): ${text.substring(0, 100)}...`
        );
      }
    }

    const result = await response.json();
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = getLocalStorage("jwt_token");
    if (!token) {
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await customPatch(token, "/v1/users/profile", formDataToSend);

      if (response.data) {
        setSuccess("Cập nhật thông tin thành công!");
        setUser(response.data);
        setLocalStorage("user_avatar", response.data.avatar || "");
      } else {
        throw new Error("Cập nhật thông tin thất bại");
      }
    } catch (err) {
      if (err.message.includes("401")) {
        deleteLocalStorage("jwt_token");
        deleteLocalStorage("user_avatar");
        navigate("/login");
        setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      } else {
        setError(err.message || "Cập nhật thông tin thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="py-5"><p>Đang tải...</p></Container>;
  }

  if (!user) {
    return (
      <Container className="py-5">
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Không thể tải thông tin người dùng.</p>
      </Container>
    );
  }

  return (
    <Container className="profile-page py-5">
      <Card className="profile-card mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">Chỉnh Sửa Thông Tin</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <div className="text-center mb-4">
            {previewAvatar ? (
              <Image
                src={previewAvatar}
                roundedCircle
                width={100}
                height={100}
                className="mb-3"
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3"
                style={{ width: 100, height: 100 }}
              >
                <span className="text-white">No Avatar</span>
              </div>
            )}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formAvatar">
              <Form.Label>Ảnh Đại Diện</Form.Label>
              <Form.Control
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Họ Tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Đang Cập Nhật..." : "Cập Nhật"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;