import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { ThemeContext } from "../contexts/ThemeContext";

const BASE_URL = "http://localhost:8000";

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [ad, setAd] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    city_id: "",
  });

  const [newImages, setNewImages] = useState([]); // صور جديدة
  const [existingImages, setExistingImages] = useState([]); // صور موجودة
  const [imagesToDelete, setImagesToDelete] = useState([]); // صور للحذف
  const [notification, setNotification] = useState(""); // للإشعارات
  const [error, setError] = useState(""); // لتخزين الأخطاء

  const { theme } = useContext(ThemeContext); // للحصول على الوضع الليلي

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [adRes, categoriesRes, citiesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/ads/${id}`),
        axios.get(`${BASE_URL}/api/categories`),
        axios.get(`${BASE_URL}/api/cities`),
      ]);

      const adData = adRes.data;
      setAd(adData);

      setCategories(categoriesRes.data);
      setCities(citiesRes.data);

      setFormData({
        title: adData.title,
        description: adData.description,
        price: adData.price,
        category_id: adData.category_id,
        city_id: adData.city_id,
      });

      let imgs = [];
      if (adData.images) {
        imgs = adData.images.map((imgObj) => imgObj.path);
      }
      setExistingImages(imgs);
    } catch (error) {
      console.error("فشل في تحميل بيانات الإعلان", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    
    // التحقق من عدد الصور الجديدة
    if (selectedImages.length + existingImages.length > 4) {
      setError("لا يمكن رفع أكثر من 4 صور إجمالاً (الموجودة والجديدة).");
    } else {
      setError("");
      setNewImages(selectedImages);
    }
  };

  const toggleDeleteExistingImage = (img) => {
    setImagesToDelete((prev) => {
      if (prev.includes(img)) {
        setExistingImages((imgs) => [...imgs, img]);
        return prev.filter((i) => i !== img);
      } else {
        setExistingImages((imgs) => imgs.filter((i) => i !== img));
        return [...prev, img];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من وجود تعديل
    const isModified = Object.keys(formData).some(
      (key) => formData[key] !== ad[key]
    );

    if (!isModified && newImages.length === 0 && imagesToDelete.length === 0) {
      setNotification("لا يوجد تعديل في البيانات.");
      return;
    }

    const data = new FormData();
    data.append("_method", "PUT");
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category_id", formData.category_id);
    data.append("city_id", formData.city_id);

    newImages.forEach((img) => {
      data.append("images[]", img);
    });

    data.append("images_to_delete", JSON.stringify(imagesToDelete));

    try {
      await axios.post(`${BASE_URL}/api/ads/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("تم ارسال الإعلان من جديد للمراجعة");

      const adRes = await axios.get(`${BASE_URL}/api/ads/${id}`);
      const adData = adRes.data;

      setAd(adData);
      setFormData({
        title: adData.title,
        description: adData.description,
        price: adData.price,
        category_id: adData.category_id,
        city_id: adData.city_id,
      });

      let imgs = [];
      if (adData.images) {
        imgs = adData.images.map((imgObj) => imgObj.path);
      }
      setExistingImages(imgs);

      navigate("/my-ads");
    } catch (error) {
      console.error("فشل تعديل الإعلان", error);
      alert("حدث خطأ أثناء تعديل الإعلان");
    }
  };

  if (!ad) return <p>جاري تحميل الإعلان...</p>;

  return (
    <div className={`container mt-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
      <Button variant={theme === 'dark' ? 'secondary' : 'primary'} onClick={() => navigate(-1)}>
        الرجوع
      </Button>
      <h2 className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}>تعديل الإعلان</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>العنوان</label>
          <input
            type="text"
            name="title"
            className={`form-control ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>الوصف</label>
          <textarea
            name="description"
            className={`form-control ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>السعر</label>
          <input
            type="number"
            name="price"
            className={`form-control ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
          />
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>التصنيف</label>
          <select
            name="category_id"
            className={`form-select ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">اختر تصنيف</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>المدينة</label>
          <select
            name="city_id"
            className={`form-select ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            value={formData.city_id}
            onChange={handleChange}
            required
          >
            <option value="">اختر مدينة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>الصور الحالية</label>
          <div className="d-flex flex-wrap gap-3">
            {existingImages.length === 0 && <p>لا توجد صور حالية</p>}
            {existingImages.map((img, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={`${BASE_URL}${img}`}
                  alt={`الصورة ${idx + 1}`}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <button
                  type="button"
                  className={`btn btn-sm ${
                    imagesToDelete.includes(img) ? "btn-danger" : "btn-outline-danger"
                  }`}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  onClick={() => toggleDeleteExistingImage(img)}
                  title={
                    imagesToDelete.includes(img)
                      ? "إلغاء حذف الصورة"
                      : "حذف الصورة"
                  }
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <small className="form-text text-muted">
            اضغط على زر الحذف لحذف الصورة من الإعلان
          </small>
        </div>

        <div className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          <label>رفع صور جديدة</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className={`form-control ${theme === 'dark' ? 'bg-dark text-light' : ''}`}
            onChange={handleNewImagesChange}
          />
          {error && <div className="text-danger">{error}</div>}
          <small className="form-text text-muted">
            يمكنك رفع أكثر من صورة جديدة
          </small>
        </div>

        {notification && (
          <div style={{ backgroundColor: '#212529', color: 'white' }} className={`alert alert-info`}>
            {notification}
          </div>
        )}

        <button type="submit" className={`btn btn-success ${theme === 'dark' ? 'btn-light' : ''}`}>
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
};

export default EditAd;
