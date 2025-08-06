import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams, Link } from 'react-router-dom';

function AdsByCategory() {
  const { categoryId } = useParams();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // نص البحث المرسل لل API

  // جلب الإعلانات مع صفحة معينة ونص البحث
  const fetchAds = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = `/categories/${categoryId}/ads?page=${page}` + (search ? `&search=${encodeURIComponent(search)}` : '');
      const res = await axios.get(url);
      const data = res.data;
      setAds(data.data || []);
      setCurrentPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
    } catch (error) {
      setError('حدث خطأ أثناء تحميل الإعلانات.');
      setAds([]);
      setCurrentPage(1);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  // تحميل الإعلانات عند تغير التصنيف، الصفحة، أو نص البحث المرسل
  useEffect(() => {
    fetchAds(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, currentPage, searchQuery]);

  // تغيير الصفحة
  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // عند الضغط زر البحث، نحدث نص البحث المرسل ونعيد للصفحة 1
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchText.trim());
  };

  // معالجة رابط الصورة
  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `/storage/${img}`;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">الإعلانات في التصنيف</h2>

      {/* نموذج البحث */}
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="ابحث في الإعلانات..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="بحث في الإعلانات"
          />
          <button className="btn btn-primary" type="submit">بحث</button>
        </div>
      </form>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">جارٍ التحميل...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && ads.length === 0 && (
        <p className="text-center">لا توجد إعلانات لعرضها في هذا التصنيف.</p>
      )}

      {!loading && !error && ads.length > 0 && (
        <>
          <div className="row">
            {ads.map((ad) => (
              <div className="col-md-4 mb-3" key={ad.id}>
                <Link to={`/ads/${ad.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100 shadow-sm">
                    {getImageUrl(ad.image_url) ? (
                      <img
                        src={getImageUrl(ad.image_url)}
                        className="card-img-top"
                        alt={ad.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white"
                        style={{ height: '200px' }}
                      >
                        بدون صورة
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{ad.title}</h5>
                      <p className="card-text text-truncate" title={ad.description || ''}>
                        {ad.description || 'لا يوجد وصف.'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                  السابق
                </button>
              </li>

              {[...Array(lastPage)].map((_, i) => {
                const page = i + 1;
                if (page >= currentPage - 2 && page <= currentPage + 2) {
                  return (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(page)}>
                        {page}
                      </button>
                    </li>
                  );
                }
                return null;
              })}

              <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                  التالي
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default AdsByCategory;
