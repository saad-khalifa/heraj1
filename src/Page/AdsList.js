import React, { useEffect, useState } from 'react';
import axios from 'axios'; // تأكد من مسار axios عندك

const AdsList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/ads')
      .then(res => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('فشل تحميل الإعلانات');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>قائمة الإعلانات</h2>
      <ul className="list-group">
        {ads.map(ad => (
          <li key={ad.id} className="list-group-item">
            <h5>{ad.title}</h5>
            <p>{ad.description}</p>
            <p><strong>السعر:</strong> {ad.price} ل.س</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdsList;
