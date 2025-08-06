import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const ChangePassword = () => {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);

    if (form.new_password !== form.new_password_confirmation) {
      setError('كلمتا المرور الجديدتان غير متطابقتين');
      setSaving(false);
      return;
    }

    try {
      await axios.get('/sanctum/csrf-cookie');

      await axios.post('/user/change-password', {
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation,
      });

      setSuccess('تم تغيير كلمة المرور بنجاح');
      setForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ أثناء تغيير كلمة المرور');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">تغيير كلمة المرور</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="current_password" className="form-label">كلمة المرور الحالية</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            className="form-control"
            required
            value={form.current_password}
            onChange={handleChange}
            minLength={6}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="new_password" className="form-label">كلمة المرور الجديدة</label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            className="form-control"
            required
            value={form.new_password}
            onChange={handleChange}
            minLength={6}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="new_password_confirmation" className="form-label">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            id="new_password_confirmation"
            name="new_password_confirmation"
            className="form-control"
            required
            value={form.new_password_confirmation}
            onChange={handleChange}
            minLength={6}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? 'جارٍ الحفظ...' : 'تغيير كلمة المرور'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
