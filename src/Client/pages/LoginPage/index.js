import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import "./LoginPage.css";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
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

    if (isLogin) {
      // Handle login
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://api.example.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) throw new Error("Login failed");
        const data = await response.json();
        setSuccess("Login successful!");
        // Handle successful login (e.g., store token, redirect)
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Handle registration
      try {
        const response = await fetch("https://api.example.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) throw new Error("Registration failed");
        const data = await response.json();
        setSuccess("Registration successful! Please log in.");
        setIsLogin(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Container className="login-page py-5">
      <Card className="login-card mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
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
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;