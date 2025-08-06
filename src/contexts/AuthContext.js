import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
    
  // محاولة جلب بيانات المستخدم عند بداية التطبيق إذا كان هناك توكن
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.get("http://localhost:8000/api/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
     })
      .catch((err) => {
        console.error("غير مسجل دخول:", err.response?.data);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
        
         // ← نوقف حالة الانتظار بعد الفحص
      });
  } else {
    setLoading(false);
    // ← حتى بدون توكن نوقف الانتظار
  }
}, []);

  // دالة تسجيل الدخول
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      // جلب بيانات المستخدم
      const userRes = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطأ في تسجيل الدخول",
      };
    }
  };

  // دالة تسجيل حساب جديد (register)
  const register = async (name, email, password, password_confirmation) => {
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      // إذا أردت تسجيل الدخول تلقائياً بعد التسجيل، يمكن إضافة ذلك هنا
      // أو يمكنك حذف هذا الجزء والانتظار لتسجيل الدخول يدوياً
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      const userRes = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطأ في التسجيل",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
  <AuthContext.Provider
    value={{
      user,
      token,
      loading,
      login,
      logout,
      register,
      setUser,    // ✅ إضافة هذه
      setToken,   // ✅ إن احتجت استخدامها في المستقبل
    }}
  >
    {children}
  </AuthContext.Provider>
);

};
