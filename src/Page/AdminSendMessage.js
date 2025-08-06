import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح

function AdminSendMessage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const token = localStorage.getItem('token');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error('فشل في جلب المستخدمين', err));
  }, [token]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.warn('يرجى إدخال العنوان والرسالة');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/admin/messages', {
        subject,
        body,
        user_id: selectedUser || null, // null = للجميع
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(selectedUser ? 'تم إرسال الرسالة للمستخدم' : 'تم إرسال الرسالة لجميع المستخدمين');
      setSubject('');
      setBody('');
      setSelectedUser('');
    } catch (error) {
      toast.error('فشل في إرسال الرسالة');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"} // ضبط الثيم للإشعارات
      />
      <h2 className={`mb-4 text-center ${theme === "dark" ? "text-light" : "text-dark"}`}>
        إرسال رسالة من الإدارة
      </h2>

      <div className="mb-3">
        <label className={theme === "dark" ? "text-light" : ""}>
          اختر المستخدم (اتركه فارغ للإرسال للجميع):
        </label>
        <select
          className={`form-select ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">إرسال للجميع</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className={theme === "dark" ? "text-light" : ""}>العنوان:</label>
        <input
          className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className={theme === "dark" ? "text-light" : ""}>الرسالة:</label>
        <textarea
          className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
          rows="4"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSend}>
        إرسال
      </button>
    </div>
  );
}

export default AdminSendMessage;
