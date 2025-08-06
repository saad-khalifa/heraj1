import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminContactMessageDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchMessage = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/contact-messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data);
      } catch (err) {
        console.error('خطأ في جلب تفاصيل الرسالة:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, token]);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (!message) return <p>لم يتم العثور على الرسالة.</p>;

  return (
    <div className="container mt-4">
      <h3>تفاصيل الرسالة #{message.id}</h3>

      <div className="card mb-3">
        <div className="card-header">
          <strong>{message.subject}</strong>
        </div>
        <div className="card-body">
          <p><strong>الاسم:</strong> {message.name}</p>
          <p><strong>البريد:</strong> {message.email}</p>
          <p><strong>التاريخ:</strong> {new Date(message.created_at).toLocaleString()}</p>
          <hr />
          <p>{message.message}</p>
        </div>
      </div>

      <h5>الردود</h5>
      {message.replies.length === 0 ? (
        <p className="text-muted">لا توجد ردود بعد.</p>
      ) : (
        message.replies.map((reply) => (
          <div key={reply.id} className="card mb-2">
            <div className="card-body">
              <p>{reply.message}</p>
              <small className="text-muted">
                {reply.user ? `بواسطة: ${reply.user.name}` : 'الادارة'} - {new Date(reply.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}

      <Link to="/admin/contact-messages" className="btn btn-secondary mt-3">
        عودة للرسائل
      </Link>
    </div>
  );
};

export default AdminContactMessageDetails;
