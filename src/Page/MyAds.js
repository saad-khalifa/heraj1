import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const MyAds = () => {
  const { user, token } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    axios.get(`${BASE_URL}/api/my-ads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setAds(res.data);
    })
    .catch((err) => {
      console.error('فشل تحميل الإعلانات', err);
    })
    .finally(() => setLoading(false));
  }, [token]);

const getImageUrl = (image) => {
  if (!image || image === null) {
    return 'https://via.placeholder.com/300x200?text=No+Image'; // صورة افتراضية
  }

  // إذا كانت الصورة تحتوي على مسار صحيح
  if (image.startsWith('storage') || image.startsWith('ads_images') || image.startsWith('/storage')) {
    return `${BASE_URL}${image.replace(/^\/?storage\//, '')}`;
  }

  // إذا كانت الصورة URL خارجي
  if (image.startsWith('http')) {
    return image;
  }

  return 'https://via.placeholder.com/300x200?text=No+Image'; // صورة افتراضية
};



  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف الإعلان؟')) return;

    try {
      await axios.delete(`${BASE_URL}/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (err) {
      console.error('خطأ في الحذف', err);
      alert('فشل في حذف الإعلان.');
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <p className="text-danger">يرجى تسجيل الدخول لعرض إعلاناتك.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">إعلاناتي</h2>

      {loading ? (
        <p>جاري تحميل الإعلانات...</p>
      ) : ads.length === 0 ? (
        <p className="text-muted">لا توجد إعلانات بعد.</p>
      ) : (
        <div className="row">
  {ads.map((ad) => (
    <div className="col-md-4 mb-3" key={ad.id}>
      <div className={`card h-100}`}>
        <div className="d-flex ">
          {/* عرض الصور على اليسار */}
          <div className="d-flex flex-column justify-content-between p-4" style={{ width: '40%' }}>
            {ad.images && ad.images.length > 0 ? (
              ad.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}${img.path}`}  // تأكد من إرسال المسار بشكل صحيح هنا
                  alt={`صورة ${idx + 1}`}
                  style={{
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    marginBottom: '10px',
                  }}
                />
              ))
            ) : (
              <img
                src="https://via.placeholder.com/300x200?text=No+Image"
                alt="لا توجد صورة"
                style={{ height: '100px', objectFit: 'cover', borderRadius: '5px' }}
              />
            )}
          </div>

          {/* عرض التفاصيل على اليمين */}
          <div className="card-body d-flex flex-column" style={{ width: '60%' }}>
            <h5 className="card-title">{ad.title}</h5>
            <p className="card-text text-muted">{ad.description}</p>
            <p className="card-text">
              {ad.city?.name || 'مدينة غير محددة'} - {ad.category?.name || 'تصنيف غير محدد'}
            </p>
            <p className="card-text text-success fw-bold">{ad.price} ل.س</p>

            {/* عرض حالة الإعلان مع الحالة المرفوضة */}
            <p className="card-text">
              حالة الإعلان:{' '}
              {ad.status === 'approved' ? (
                <span className="badge bg-success">موافق عليه</span>
              ) : ad.status === 'pending' ? (
                <span className="badge bg-warning text-dark">قيد الانتظار</span>
              ) : ad.status === 'rejected' ? (
                <span className="badge bg-danger">مرفوض</span>
              ) : (
                <span className="badge bg-secondary">غير معروف</span>
              )}
            </p>

            {/* عرض سبب الرفض إذا موجود */}
            {ad.status === 'rejected' && ad.rejection_reason && (
              <p className="card-text text-danger">
                سبب الرفض: {ad.rejection_reason}
              </p>
            )}

            <div className="mt-auto">
              <button
                onClick={() => navigate(`/ads/${ad.id}`)}
                className="btn btn-sm btn-outline-primary me-2"
              >
                عرض
              </button>
              <button
                onClick={() => navigate(`/edit-ad/${ad.id}`)}
                className="btn btn-sm btn-outline-warning me-2"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(ad.id)}
                className="btn btn-sm btn-outline-danger"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
};

export default MyAds;
