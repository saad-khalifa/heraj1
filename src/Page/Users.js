import axios from "axios";
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/admin/users')
      .then(res => {
        setUsers(res.data);
        setError(null);
      })
      .catch(() => setError('فشل تحميل قائمة المستخدمين'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    setActionLoading(true);
    axios.delete(`http://localhost:8000/api/admin/users/${id}`)
      .then(() => {
        fetchUsers();
      })
      .catch(() => alert('فشل حذف المستخدم'))
      .finally(() => setActionLoading(false));
  };

  const toggleAdmin = (id) => {
    setActionLoading(true);
    axios.put(`http://localhost:8000/api/admin/users/${id}/toggle-admin`)
      .then(() => {
        fetchUsers();
      })
      .catch(() => alert('فشل تبديل صلاحية المدير'))
      .finally(() => setActionLoading(false));
  };

  if (loading) return <div className="alert alert-info">جارٍ تحميل المستخدمين...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">إدارة المستخدمين</h2>
      <button className="btn btn-outline-primary mb-3" onClick={fetchUsers} disabled={actionLoading}>
        🔄 تحديث القائمة
      </button>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>الاسم</th>
            <th>الإيميل</th>
            <th>نشط</th>
            <th>مدير</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">لا يوجد مستخدمين</td>
            </tr>
          )}
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_active ? '✅' : '❌'}</td>
              <td>{user.is_admin ? '✔️' : '❌'}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger me-2"
                  disabled={actionLoading}
                  onClick={() => deleteUser(user.id)}
                >
                  حذف
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  disabled={actionLoading}
                  onClick={() => toggleAdmin(user.id)}
                >
                  تبديل صلاحية المدير
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
