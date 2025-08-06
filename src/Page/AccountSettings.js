import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_image: null, // ملف جديد من input
    existing_profile_image: null, // مسار الصورة الموجودة حالياً
    remove_image: false, // علامة حذف الصورة
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        profile_image: null,
        existing_profile_image: user.profile_image || null,
        remove_image: false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData({ 
        ...formData, 
        profile_image: files[0], 
        remove_image: false,  // رفع حذف إذا تم اختيار صورة جديدة
        existing_profile_image: formData.existing_profile_image, 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profile_image: null,
      remove_image: true,
      existing_profile_image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);

    if (formData.password) {
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
    }

    // إذا رفعنا صورة جديدة
    if (formData.profile_image) {
      data.append("profile_image", formData.profile_image);
    }

    // إذا ضغطنا حذف الصورة
    if (formData.remove_image) {
      data.append("remove_image", "true");
    }

    data.append("_method", "PUT");

    try {
      const res = await axios.post("http://localhost:8000/api/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("success");
      setUser(res.data.user);

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("خطأ التحديث:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>إعدادات الحساب</h2>
      {status === "success" && (
        <Alert variant="success">✅ تم التحديث بنجاح، سيتم تحويلك إلى صفحة البروفايل...</Alert>
      )}
      {status === "error" && (
        <Alert variant="danger">❌ حدث خطأ أثناء التحديث. تأكد من صحة البيانات.</Alert>
      )}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>الاسم</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.name && errors.name[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>البريد الإلكتروني</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.email && errors.email[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>كلمة المرور (اختياري)</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password && errors.password[0]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>تأكيد كلمة المرور</Form.Label>
          <Form.Control
            type="password"
            name="password_confirmation"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>صورة البروفايل</Form.Label>
          <div className="d-flex align-items-center gap-3">
            <Form.Control
              type="file"
              name="profile_image"
              onChange={handleChange}
            />

            {formData.existing_profile_image && !formData.remove_image && (
              <>
                <img
                  src={`http://localhost:8000/storage/${formData.existing_profile_image}`}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                />
                <Button variant="danger" size="sm" onClick={handleRemoveImage}>
                  حذف الصورة
                </Button>
              </>
            )}
          </div>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              جاري التحديث...
            </>
          ) : (
            "تحديث الحساب"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AccountSettings;
