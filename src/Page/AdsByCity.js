import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams, Link } from 'react-router-dom';

function AdsByCity() {
  const { cityId } = useParams();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchAds = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/cities/${cityId}/ads?page=${page}`);
      const data = res.data;
      setAds(data.data || []);
      setCurrentPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
    } catch (error) {
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(currentPage);
  }, [cityId, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>جارٍ التحميل...</p>;

  return (
    <div className="container mt-4">
      <h2>الإعلانات في المدينة</h2>
      {ads.length > 0 ? (
        <>
          <div className="row">
            {ads.map(ad => (
              <div className="col-md-4 mb-3" key={ad.id}>
                <Link to={`/ads/${ad.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100">
                    {ad.image_url ? (
                      <img
                        src={ad.image_url}
                        className="card-img-top"
                        alt={ad.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: '200px' }}>
                        بدون صورة
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{ad.title}</h5>
                      <p className="card-text text-truncate">{ad.description || ''}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>السابق</button>
              </li>

              {[...Array(lastPage)].map((_, i) => {
                const page = i + 1;
                if (page >= currentPage - 2 && page <= currentPage + 2) {
                  return (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(page)}>{page}</button>
                    </li>
                  );
                }
                return null;
              })}

              <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>التالي</button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <p>لا توجد إعلانات لعرضها في هذه المدينة.</p>
      )}
    </div>
  );
}

export default AdsByCity;
