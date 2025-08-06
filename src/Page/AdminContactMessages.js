import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const AdminContactMessages = () => {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/contact-messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('فشل في تحميل الرسائل', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الرسالة؟')) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/contact-messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('خطأ أثناء حذف الرسالة', err);
      alert('فشل في حذف الرسالة.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>رسائل التواصل</h3>
      {loading ? (
        <p>جاري تحميل الرسائل...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted">لا توجد رسائل حالياً.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد</th>
                <th>الموضوع</th>
                <th>الرسالة</th>
                <th>تاريخ الإرسال</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg.id}>
                  <td>{index + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email || '-'}</td>
                  <td>{msg.subject || '-'}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(msg.id)} className="btn btn-sm btn-danger">
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
