import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8000";

export default function NewAd() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    city_id: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  // جلب التصنيفات
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      return res.data;
    },
  });

  // جلب المدن
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/cities`);
      return res.data;
    },
  });

  // إرسال إعلان جديد
  const createAdMutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category_id", form.category_id);
      data.append("city_id", form.city_id);

      images.forEach((img) => data.append("images[]", img));

      await axios.post(`${BASE_URL}/api/ads`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      alert("تم إرسال الإعلان للمراجعة وسيتم عرضه بعد الموافقة عليه");
      navigate("/my-ads");
    },
    onError: (err) => {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("حدث خطأ أثناء الإرسال");
        console.error(err);
      }
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    
    if (selectedImages.length > 4) {
      setErrors({ ...errors, images: ["لا يمكن رفع أكثر من 4 صور"] });
    } else {
      setImages(selectedImages);
      setErrors({ ...errors, images: null }); // Clear any existing errors if valid
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من أن عدد الصور لا يتجاوز 4 قبل الإرسال
    if (images.length > 4) {
      setErrors({ ...errors, images: ["لا يمكن رفع أكثر من 4 صور"] });
      return; // إيقاف تنفيذ الكود إذا كانت الصور أكثر من 4
    }

    setErrors({}); // إزالة أي أخطاء قديمة قبل الإرسال
    createAdMutation.mutate();
  };

  return (
    <div className="container">
      <h2 className="mb-4">إضافة إعلان جديد</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>العنوان</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <div className="text-danger">{errors.title[0]}</div>}
        </div>

        <div className="mb-3">
          <label>الوصف</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <div className="text-danger">{errors.description[0]}</div>}
        </div>

        <div className="mb-3">
          <label>السعر</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && <div className="text-danger">{errors.price[0]}</div>}
        </div>

        <div className="mb-3">
          <label>التصنيف</label>
          <select
            name="category_id"
            className="form-control"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">اختر تصنيف</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && <div className="text-danger">{errors.category_id[0]}</div>}
        </div>

        <div className="mb-3">
          <label>المحافظة</label>
          <select
            name="city_id"
            className="form-control"
            value={form.city_id}
            onChange={handleChange}
          >
            <option value="">اختر محافظة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city_id && <div className="text-danger">{errors.city_id[0]}</div>}
        </div>

        <div className="mb-3">
          <label>صور الإعلان (يمكن اختيار أكثر من صورة)</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
          {errors.images && <div className="text-danger">{errors.images[0]}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={createAdMutation.isLoading}>
          {createAdMutation.isLoading ? "جاري الإرسال..." : "إضافة"}
        </button>
      </form>
    </div>
  );
}
