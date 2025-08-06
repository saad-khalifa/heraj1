import React, { useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

function AdminAds() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const { theme } = useContext(ThemeContext);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data: adsData, isLoading, isError } = useQuery({
    queryKey: ['adminAds', page],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/admin/ads?page=${page}`, axiosConfig);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (adId) => {
      await axios.delete(`${BASE_URL}/api/admin/ads/${adId}`, axiosConfig);
    },
    onSuccess: () => {
      toast.success('تم حذف الإعلان');
      queryClient.invalidateQueries({ queryKey: ['adminAds', page] });
    },
    onError: () => {
      toast.error('فشل في حذف الإعلان');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف الإعلان؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (adId) => {
    navigate(`/ads/${adId}`);
  };

  const filteredAds = useMemo(() => {
    if (!adsData?.data) return [];

    const sorted = [...adsData.data].sort((a, b) => {
      if (a.status === 'approved' && b.status !== 'approved') return -1;
      if (a.status !== 'approved' && b.status === 'approved') return 1;
      return 0;
    });

    if (!searchInput.trim()) return sorted;

    return sorted.filter((ad) =>
      (ad.title && ad.title.toLowerCase().includes(searchInput.toLowerCase())) ||
      (ad.user?.name && ad.user.name.toLowerCase().includes(searchInput.toLowerCase()))
    );
  }, [adsData, searchInput]);

  if (!token)
    return <div className="alert alert-warning text-center mt-5">يجب تسجيل الدخول للوصول إلى هذه الصفحة</div>;
  if (isLoading)
    return <div className="text-center mt-5">جاري التحميل...</div>;
  if (isError)
    return <div className="alert alert-danger text-center mt-5">فشل في تحميل البيانات</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className={`mb-4 text-center ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
        إدارة الإعلانات
      </h2>

      {/* مربع البحث */}
      <div className="d-flex mb-4">
        <input
          type="text"
          className={`form-control me-2 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
          placeholder="ابحث باسم الإعلان أو المستخدم..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <table className={`table table-bordered table-hover text-center ${theme === 'dark' ? 'table-dark' : ''}`}>
        <thead className={theme === 'dark' ? 'table-secondary' : 'table-dark'}>
          <tr>
            <th>العنوان</th>
            <th>السعر</th>
            <th>المستخدم</th>
            <th>الحالة</th>
            <th>التحكم</th>
          </tr>
        </thead>
        <tbody>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <tr key={ad.id}>
                <td>{ad.title}</td>
                <td>{ad.price} ل.س</td>
                <td>{ad.user?.name || 'غير معروف'}</td>
                <td>
                  <span
                    className={`badge ${
                      ad.status === 'approved'
                        ? 'bg-success'
                        : theme === 'dark'
                        ? 'bg-warning text-dark'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {ad.status === 'pending' ? 'معلق' : ad.status === 'approved' ? 'مقبول' : 'غير معروف'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${ad.status === 'approved' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleDelete(ad.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading ? 'جارٍ الحذف...' : 'حذف'}
                  </button>
                  <button
                    className="btn btn-info btn-sm ms-2"
                    onClick={() => handleViewDetails(ad.id)}
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={`text-center ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                لا توجد نتائج
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* التنقل بين الصفحات */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          الصفحة السابقة
        </button>
        <span className={`${theme === 'dark' ? 'text-light' : ''}`}>
          الصفحة {adsData?.current_page} من {adsData?.last_page}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page === adsData?.last_page}
          onClick={() => setPage((prev) => Math.min(prev + 1, adsData?.last_page))}
        >
          الصفحة التالية
        </button>
      </div>
    </div>
  );
}

export default AdminAds;
