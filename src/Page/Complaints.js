import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const Complaints = () => {
  const [form, setForm] = useState({
    subject: '',
    message: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSending(true);

    if (!form.subject.trim() || !form.message.trim()) {
      setError('يرجى تعبئة جميع الحقول');
      setSending(false);
      return;
    }

    try {
      await axios.get('/sanctum/csrf-cookie');

      await axios.post('/complaints', form);

      setSuccess('تم إرسال الشكوى بنجاح');
      setForm({ subject: '', message: '' });
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ أثناء إرسال الشكوى');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">إرسال شكوى</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="subject" className="form-label">عنوان الشكوى</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="form-control"
            required
            value={form.subject}
            onChange={handleChange}
            minLength={3}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">تفاصيل الشكوى</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            rows="5"
            required
            value={form.message}
            onChange={handleChange}
            minLength={10}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-danger w-100" disabled={sending}>
          {sending ? 'جارٍ الإرسال...' : 'إرسال الشكوى'}
        </button>
      </form>
    </div>
  );
};

export default Complaints;
