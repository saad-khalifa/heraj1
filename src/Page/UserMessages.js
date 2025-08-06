import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:8000';

const UserMessages = () => {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const prevMessagesRef = useRef([]);

  useEffect(() => {
    if (!token || !user) return;

    let pollingInterval;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newMessages = res.data;

        if (newMessages.length > 0) {
          // تحقق من وجود رسالة جديدة مقارنة مع الرسائل السابقة
          if (
            prevMessagesRef.current.length > 0 &&
            newMessages[0].id !== prevMessagesRef.current[0].id
          ) {
            toast.info(`📩 رسالة جديدة: ${newMessages[0].subject}`);
          }

          setMessages(newMessages);
          prevMessagesRef.current = newMessages; // حدّث المرجع
        }
      } catch (err) {
        console.error('فشل في جلب الرسائل', err);
      }
    };

    fetchMessages();
    pollingInterval = setInterval(fetchMessages, 5000);

    return () => clearInterval(pollingInterval);
  }, [token, user]);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">📬 الرسائل الواردة من الإدارة</h2>

      {messages.length === 0 ? (
        <div className="alert alert-info text-center">لا توجد رسائل بعد</div>
      ) : (
        <div className="list-group">
          {messages.map(msg => (
            <div key={msg.id} className="list-group-item list-group-item-action">
              <h5>{msg.subject}</h5>
              <p>{msg.body}</p>
              <small className="text-muted">{new Date(msg.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMessages;
