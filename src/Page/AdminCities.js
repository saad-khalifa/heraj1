import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح

function AdminCities() {
  const [cities, setCities] = useState([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const { theme } = useContext(ThemeContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/cities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      toast.error('فشل في جلب المدن');
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return toast.warn('الرجاء إدخال اسم المدينة');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/cities',
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('تمت الإضافة');
      setNewName('');
      const newCity = response.data?.data || response.data;
      setCities((prev) => [...prev, newCity]);

    } catch (error) {
      if (error.response) {
        console.error('Server Response:', error.response.data);
        toast.error(error.response.data.message || 'فشل في الإضافة');
      } else {
        console.error(error);
        toast.error('خطأ في الاتصال بالسيرفر');
      }
    }
  };

  const startEdit = (city) => {
    setEditId(city.id);
    setEditName(city.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.warn('الرجاء إدخال اسم المدينة');
    try {
      await axios.put(
        `http://localhost:8000/api/admin/cities/${id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('تم تحديث اسم المدينة');
      cancelEdit();
      fetchCities();
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/cities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('تم حذف المدينة');
      fetchCities();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className={`mb-4 text-center ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
        إدارة المدن
      </h2>

      <div className="d-flex mb-4">
        <input
          type="text"
          className={`form-control me-2 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
          placeholder="اسم المدينة الجديدة"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>إضافة</button>
      </div>

      <table className={`table table-bordered table-hover text-center ${theme === 'dark' ? 'table-dark' : ''}`}>
        <thead className={theme === 'dark' ? 'table-secondary' : 'table-dark'}>
          <tr>
            <th>الاسم</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td>
                {editId === city.id ? (
                  <input
                    type="text"
                    className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  city.name
                )}
              </td>
              <td>
                {editId === city.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdate(city.id)}>حفظ</button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>إلغاء</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(city)}>تعديل</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(city.id)}>حذف</button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {cities.length === 0 && (
            <tr>
              <td colSpan="2" className={`text-center ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                لا توجد مدن
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCities;
