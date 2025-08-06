import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const MessageForm = ({ receiverId, adId }) => {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post('http://localhost:8000/api/messages', {
        receiver_id: receiverId,
        ad_id: adId,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus('تم إرسال الرسالة بنجاح');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('فشل في إرسال الرسالة');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="اكتب رسالتك هنا..."
        rows={4}
        required
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-primary">إرسال</button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  );
};

export default MessageForm;
