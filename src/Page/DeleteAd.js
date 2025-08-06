import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@/api/axios';

const DeleteAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/ads/${id}`)
      .then(res => setAd(res.data))
      .catch(() => setError('لا يمكن تحميل بيانات الإعلان.'));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/ads/${id}`);
      navigate('/my-ads');
    } catch (err) {
      setError('حدث خطأ أثناء حذف الإعلان.');
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (!ad) return <div className="text-center mt-5">جاري التحميل...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-danger">هل أنت متأكد من حذف هذا الإعلان؟</h2>
      <div className="border p-4 rounded shadow-sm mb-4">
        <h4>{ad.title}</h4>
        <p>{ad.description}</p>
        <p><strong>السعر:</strong> {ad.price} ل.س</p>
      </div>
      <div className="d-flex gap-2">
        <button onClick={handleDelete} className="btn btn-danger">نعم، احذف الإعلان</button>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">إلغاء</button>
      </div>
    </div>
  );
};

export default DeleteAd;
