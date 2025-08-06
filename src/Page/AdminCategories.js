import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const { theme } = useContext(ThemeContext); // جلب الثيم
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
      if (error.response) {
        alert(`حدث خطأ: ${error.response.status} - ${error.response.statusText}`);
      } else {
        alert('حدث خطأ في الاتصال بالسيرفر');
      }
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return alert('الرجاء إدخال اسم القسم');
    try {
      await axios.post(
        'http://localhost:8000/api/admin/categories',
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewName('');
      fetchCategories();
    } catch (error) {
      alert('حدث خطأ أثناء الإضافة');
      console.error(error);
    }
  };

  const startEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return alert('الرجاء إدخال اسم القسم');
    try {
      await axios.put(
        `http://localhost:8000/api/admin/categories/${id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditName('');
      fetchCategories();
    } catch (error) {
      alert('حدث خطأ أثناء التحديث');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      alert('حدث خطأ أثناء الحذف');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className={`mb-4 text-center ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
        إدارة الأقسام
      </h2>

      <div className="mb-4 d-flex">
        <input
          type="text"
          placeholder="اسم القسم الجديد"
          className={`form-control me-2 ${
            theme === 'dark' ? 'bg-dark text-white border-secondary' : ''
          }`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaPlus /> إضافة
        </button>
      </div>

      <table
        className={`table table-bordered text-center ${
          theme === 'dark' ? 'table-dark' : ''
        }`}
      >
        <thead className={theme === 'dark' ? 'table-secondary' : 'table-dark'}>
          <tr>
            <th>الاسم</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {editId === category.id ? (
                    <input
                      type="text"
                      className={`form-control ${
                        theme === 'dark' ? 'bg-dark text-white border-secondary' : ''
                      }`}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>
                  {editId === category.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleUpdate(category.id)}
                      >
                        <FaSave /> حفظ
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={cancelEdit}
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => startEdit(category)}
                      >
                        <FaEdit /> تعديل
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category.id)}
                      >
                        <FaTrash /> حذف
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">لا توجد أقسام</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;
