import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user, token, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchUsers(currentPage);
    }
  }, [user, currentPage]);

  const fetchUsers = async (page) => {
    setLoadingUsers(true);
    try {
      // إذا كان API يدعم pagination:
      // ارسل الصفحة وعدد المستخدمين لكل صفحة كـ query params
      const res = await axios.get('http://localhost:8000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: usersPerPage,
        },
      });

      // افترضنا أن الاستجابة بهذا الشكل:
      // { data: [...users], total: 100, current_page: 1, last_page: 10 }
      setUsers(res.data.data || []);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      console.error('فشل في جلب المستخدمين', err);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // إعادة تحميل الصفحة الحالية
      fetchUsers(currentPage);
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
      console.error(err);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${id}/toggle-admin`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(currentPage);
    } catch (err) {
      alert('حدث خطأ أثناء تغيير الصلاحيات');
      console.error(err);
    }
  };

  // حساب عدد الصفحات
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading || loadingUsers)
    return <p className="text-center mt-5">جاري التحميل...</p>;

  return (
    <div className="container mt-5">
      <h2
        className={`mb-4 text-center ${
          theme === 'dark' ? 'text-light' : 'text-dark'
        }`}
      >
        إدارة المستخدمين
      </h2>

      <table
        className={`table table-bordered text-center ${
          theme === 'dark' ? 'table-dark' : ''
        }`}
      >
        <thead className={theme === 'dark' ? 'table-secondary' : 'table-dark'}>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>مشرف؟</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4">لا يوجد مستخدمون</td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? 'نعم' : 'لا'}</td>
              <td>
                <button
                  onClick={() => toggleAdmin(user.id)}
                  className={`btn btn-sm ${
                    user.is_admin ? 'btn-warning' : 'btn-success'
                  } me-2`}
                >
                  {user.is_admin ? (
                    <>
                      <FaUser /> إزالة المشرف
                    </>
                  ) : (
                    <>
                      <FaUserShield /> جعله مشرف
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn-sm btn-danger"
                >
                  <FaTrash /> حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* أزرار التصفح */}
      <nav aria-label="Page navigation" className="d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              السابق
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <li
                key={pageNum}
                className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              التالي
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminUsers;
