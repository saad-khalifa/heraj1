import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/contact-messages/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('فشل في جلب الرسائل:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('هل تريد حذف هذه الرسالة نهائياً؟')) return;

    try {
      await axios.delete(`http://localhost:8000/api/contact-messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // تحديث القائمة بعد الحذف
      fetchMessages();
    } catch (error) {
      console.error('فشل حذف الرسالة:', error);
      alert('حدث خطأ أثناء حذف الرسالة');
    }
  };

  return (
    <div className="container mt-4">
      <h3>تذاكري (رسائل التواصل)</h3>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : messages.length === 0 ? (
        <p>لا توجد رسائل حتى الآن.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>الموضوع</th>
              <th>التاريخ</th>
              <th>الردود</th>
              <th>العملية</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, i) => (
              <tr key={msg.id}>
                <td>{i + 1}</td>
                <td>{msg.subject}</td>
                <td>{new Date(msg.created_at).toLocaleString()}</td>
                <td>{msg.replies ? msg.replies.length : 0}</td>
                <td>
                  <Link to={`/my-contact/${msg.id}`} className="btn btn-sm btn-primary me-2">
                    عرض
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteMessage(msg.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTickets;
