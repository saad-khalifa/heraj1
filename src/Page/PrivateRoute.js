import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>جارٍ التحقق من تسجيل الدخول...</div>;

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
