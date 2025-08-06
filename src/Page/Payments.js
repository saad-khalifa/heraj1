import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);

  // بدء عملية الدفع والحصول على رابط الدفع من الباك إند
  const handleStartPayment = async () => {
    setLoading(true);
    setError(null);
    setPaymentUrl(null);

    try {
      await axios.get('/sanctum/csrf-cookie');

      const res = await axios.post('/payments/create', {
        amount: 1000, // المبلغ يمكن تغييره أو جلبه من حالة التطبيق
        currency: 'USD',
      });

      if (res.data.payment_url) {
        setPaymentUrl(res.data.payment_url);
      } else {
        setError('تعذر الحصول على رابط الدفع');
      }
    } catch (err) {
      setError('حدث خطأ أثناء بدء الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">الدفع الإلكتروني</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {paymentUrl ? (
        <div className="text-center">
          <p>اضغط الرابط التالي لإتمام الدفع:</p>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success">
            إتمام الدفع
          </a>
        </div>
      ) : (
        <button className="btn btn-primary w-100" onClick={handleStartPayment} disabled={loading}>
          {loading ? 'جارٍ معالجة الدفع...' : 'ابدأ الدفع'}
        </button>
      )}
    </div>
  );
};

export default Payments;
