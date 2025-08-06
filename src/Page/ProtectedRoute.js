// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { user } = useContext(AuthContext);

  // لو المستخدم موجود (مسجل دخول)، نسمح بالوصول (render children)
  // وإلا نعيد توجيه لصفحة تسجيل الدخول
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
