// AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { get, postPublic } from "../share/utils/http";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (token) => {
    try {
      const data = await get(token, "/admin/users/profile");
      console.log("Fetch user response:", data.data);
      
      if (data.status !== "error") {
        setUser({
          name: data.data.name || "Người dùng",
          email: data.data.email || "Không có email",
          avatar: data.data.avatar || "https://via.placeholder.com/40",
          username: data.data.username || "Không có tên người dùng",
          role: data.data.role || "Không có vai trò",
          status: data.data.status || "Không có trạng thái",
          createdAt: data.data.createdAt || new Date().toISOString(),
          updatedAt: data.data.updatedAt || new Date().toISOString(),
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]); // Chỉ chạy khi fetchUser thay đổi (tức là chỉ chạy một lần)

  const login = async (username, password) => {
    try {
      const data = await postPublic("/admin/auth/login", { username, password });
      console.log("Login response:", data);
      if (data.status !== "error") {
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