import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';

function DetailAd() {
  const { id } = useParams(); // ناخذ id الإعلان من رابط الصفحة
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAd() {
      try {
        const res = await axios.get(`/api/ads/${id}`);
        const adData = Array.isArray(res.data) ? res.data[0] : res.data;
        setAd(adData);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات الإعلان');
      } finally {
        setLoading(false);
      }
    }

    fetchAd();
  }, [id]);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p>{error}</p>;
  if (!ad) return <p>لا يوجد إعلان بهذا المعرف.</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        العودة
      </button>

      <h2>{ad.title}</h2>

      {ad.image_url ? (
        <img
          src={ad.image_url}
          alt={ad.title}
          className="img-fluid mb-3"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      ) : (
        <p>لا توجد صورة للإعلان</p>
      )}

      <p>{ad.description || 'لا يوجد وصف للإعلان.'}</p>

      <p><strong>المدينة:</strong> {ad.city_name || 'غير محددة'}</p>
      <p><strong>التصنيف:</strong> {ad.category_name || 'غير محدد'}</p>
      <p><strong>تاريخ النشر:</strong> {new Date(ad.created_at).toLocaleDateString('ar-EG')}</p>
    </div>
  );
}

export default DetailAd;
