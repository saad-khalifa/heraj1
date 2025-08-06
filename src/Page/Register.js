// src/pages/Register.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // عدل المسار حسب مشروعك
import { useNavigate } from "react-router-dom";
import Loading from "../Componnent/Loading/Loading";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const[loading,setLoading]=useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (password !== password_confirmation) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    const result = await register(name, email, password, password_confirmation);

    if (result.success) {
      // تسجيل ناجح - تحويل لصفحة الرئيسية أو أي صفحة أخرى
      navigate("/");
    } else {
      setLoading(false);
      // عرض رسالة الخطأ
      setError(result.message);
    }
  };

  return (
    <>
    {loading && <Loading/>}
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>إنشاء حساب جديد</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>الاسم الكامل</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
          />
        </div>
        <div className="mb-3">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>
        <div className="mb-3">
          <label>كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
          />
        </div>
        <div className="mb-3">
          <label>تأكيد كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            required
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="أعد كتابة كلمة المرور"
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          تسجيل
        </button>
      </form>
    </div>
    </>
  );
}
