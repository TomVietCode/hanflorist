import React from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useCart();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;