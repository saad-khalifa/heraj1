// src/pages/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Componnent/Loading/Loading";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const [loading,setLoading]=useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setLoading(false)
      setError(result.message);
    }
  };

  return (
    <>
    {loading && <Loading/>}
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>تسجيل الدخول</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>
        <button type="submit" className="btn btn-primary">دخول</button>
      </form>
    </div>
    </>
  );
}
