// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/admin/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetch user response:", data);
      if (response.ok) {
        setUser({
          name: data.name || "Người dùng",
          email: data.email || "Không có email",
          avatar: data.avatar || "https://via.placeholder.com/40",
          username: data.username || "Không có tên người dùng",
          role: data.role || "Không có vai trò",
          status: data.status || "Không có trạng thái",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      } else {
        console.error("Failed to fetch user:", data.message);
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/admin/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok) {
        localStorage.setItem("token", data.data);
        await fetchUser(data.data);
        return true;
      } else {
        throw new Error(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedPassword");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);