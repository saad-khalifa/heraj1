import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:8000';

function AdminAdsApproval() {
  const queryClient = useQueryClient();
  const [expandedAdId, setExpandedAdId] = useState(null);
  const [page, setPage] = useState(1);

  const { user, token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const { data: adsData, isLoading, isError } = useQuery({
    queryKey: ['pendingAds', page],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/admin/ads/pending`, {
        ...axiosConfig,
        params: { page, per_page: 10 },
      });
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejection_reason }) => {
      return axios.patch(`${BASE_URL}/api/admin/ads/${id}/status`, { status, rejection_reason }, axiosConfig);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['pendingAds']);
      setExpandedAdId(null);
      toast.success(
        variables.status === 'approved' ? 'تمت الموافقة على الإعلان بنجاح' : 'تم رفض الإعلان',
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark', // التأكد من توافق الإشعار مع الوضع الليلي
        }
      );
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء تحديث حالة الإعلان');
      console.error(error);
    },
  });

  const handleReject = (adId) => {
    const reason = prompt('يرجى إدخال سبب رفض الإعلان:');
    if (!reason || reason.trim() === '') {
      toast.warn('السبب لا يمكن أن يكون فارغاً.');
      return;
    }
    updateStatusMutation.mutate({ id: adId, status: 'rejected', rejection_reason: reason });
  };

  const renderImages = (images) => {
    if (!images || images.length === 0) return <p>لا توجد صور</p>;

    return (
      <div className="d-flex gap-2 overflow-auto" style={{ maxHeight: 120 }}>
        {images.map((img, idx) => {
          const imageUrl = img.path
            ? `${BASE_URL}${img.path.startsWith('/') ? '' : '/'}${img.path}`
            : 'https://via.placeholder.com/300x200?text=No+Image';

          return (
            <img
              key={idx}
              src={imageUrl}
              alt={`صورة الإعلان ${idx + 1}`}
              style={{ height: 100, borderRadius: 4, objectFit: 'cover' }}
            />
          );
        })}
      </div>
    );
  };

  if (!token || !user || !user.is_admin) {
    return <div className="alert alert-danger mt-4 text-center">غير مصرح لك بالوصول إلى هذه الصفحة</div>;
  }

  if (isLoading) return <div>جاري التحميل...</div>;
  if (isError || !adsData || !adsData.data) return <div>فشل في تحميل الإعلانات</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>إدارة الموافقة على الإعلانات</h2>

      {adsData.data.length === 0 ? (
        <div style={{ backgroundColor:'#0D6EFD' }} className="alert alert-info">لا يوجد إعلانات بحاجة للموافقة حالياً</div>
      ) : (
        <>
          <table className={`table table-bordered align-middle ${theme === 'dark' ? 'table-dark' : ''}`}>
            <thead className={theme === 'dark' ? 'table-secondary' : 'table-dark'}>
              <tr>
                <th>العنوان</th>
                <th>المستخدم</th>
                <th>الحالة</th>
                <th>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {adsData.data.map((ad) => (
                <React.Fragment key={ad.id}>
                  <tr>
                    <td>{ad.title}</td>
                    <td>{ad.user?.name || 'غير معروف'}</td>
                    <td><span className="badge bg-secondary">قيد المراجعة</span></td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setExpandedAdId(expandedAdId === ad.id ? null : ad.id)}
                        >
                          {expandedAdId === ad.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          disabled={updateStatusMutation.isLoading}
                          onClick={() => updateStatusMutation.mutate({ id: ad.id, status: 'approved' })}
                        >
                          موافقة
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={updateStatusMutation.isLoading}
                          onClick={() => handleReject(ad.id)}
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedAdId === ad.id && (
                    <tr>
                      <td colSpan="4" className={theme === 'dark' ? 'bg-secondary text-light' : ''}>
                        <h5>تفاصيل الإعلان</h5>
                        <p><strong>الوصف:</strong> {ad.description || 'لا يوجد وصف'}</p>
                        <p><strong>السعر:</strong> {ad.price} ل.س</p>
                        <p><strong>التصنيف:</strong> {ad.category?.name || 'غير محدد'}</p>
                        <p><strong>المدينة:</strong> {ad.city?.name || 'غير محددة'}</p>
                        <div><strong>الصور:</strong> {renderImages(ad.images)}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* أزرار التصفح */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <button
              className="btn btn-sm btn-outline-light" 
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!adsData.prev_page_url}
            >
              السابق
            </button>

            {adsData.links
              .filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
              .map((link, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline-light'}`}
                  onClick={() => {
                    const pageNumber = Number(link.label);
                    if (!isNaN(pageNumber)) setPage(pageNumber);
                  }}
                  disabled={!link.url}
                >
                  {link.label}
                </button>
              ))}

            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!adsData.next_page_url}
            >
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAdsApproval;
