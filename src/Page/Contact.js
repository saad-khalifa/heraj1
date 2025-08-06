import React, { useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../contexts/ThemeContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // success | error
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // تأكد من وجود التوكن هنا

    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/contact-messages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // تأكد من إرسال التوكن هنا
          },
        }
      );

      if (response.status === 201) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">تواصل معنا</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">الاسم الكامل</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="أدخل اسمك الكامل"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="أدخل بريدك الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="subject" className="form-label">الموضوع</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="form-control"
            placeholder="موضوع الرسالة"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">نص الرسالة</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            rows="5"
            placeholder="اكتب رسالتك هنا"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
        </button>

        {status && (
  <div
    className="mt-3 alert text-center"
    role="alert"
    style={{
      backgroundColor:
        theme === "dark"
          ? status === "success"
            ? "#2e7d32"
            : "#c62828"
          : status === "success"
          ? "#d4edda"
          : "#f8d7da",
      color: "#fff",
      border: "none"
    }}
  >
    {status === "success"
      ? "تم إرسال رسالتك بنجاح!"
      : "حدث خطأ في إرسال الرسالة. يرجى المحاولة لاحقاً."}
  </div>
)}

      </form>
    </div>
  );
};

export default Contact;
