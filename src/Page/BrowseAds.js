import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import Footer from './Footer';
import { Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import FavoriteButton from '../Componnent/FavoriteButton';

function BrowseAds() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCitiesAndCategories = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          axios.get('/cities'),
          axios.get('/categories'),
        ]);
        setCities(citiesRes.data);
        setCategories(categoriesRes.data);

        if (user) {
          const favRes = await axios.get('/favorites', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setFavoriteIds(favRes.data.map((f) => f.id));
        } else {
          setFavoriteIds([]);
        }
      } catch (error) {
        console.error('خطأ في تحميل البيانات', error);
      }
    };
    fetchCitiesAndCategories();
  }, [user]);

  useEffect(() => {
    setAds([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [selectedCity, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage, selectedCity, selectedCategory, searchTerm]);

  const fetchAds = async (page) => {
    setLoading(true);
    try {
      const params = { page };
      if (selectedCity) params.city = selectedCity;
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await axios.get('/ads', { params });
      const newAds = res.data.data || [];
      setAds((prev) => (page === 1 ? newAds : [...prev, ...newAds]));
      setHasMore(res.data.current_page < res.data.last_page);
    } catch (error) {
      console.error('فشل تحميل الإعلانات', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (adId) => {
    setFavoriteIds((prev) =>
      prev.includes(adId)
        ? prev.filter((id) => id !== adId)
        : [...prev, adId]
    );
  };

  const handleCityFilter = (cityId) => {
    setSelectedCity(cityId === selectedCity ? null : cityId);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowMore = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  // دالة عرض الصور
  const renderImages = (images) => {
    if (!images || images.length === 0) return <p>لا توجد صور</p>;

    return (
      <div className="d-flex gap-2 overflow-auto" style={{ maxHeight: 120, maxWidth: '100%' }}>
        {images.map((img, idx) => {
          const imageUrl = img.path
            ? `http://localhost:8000${img.path}`
            : 'https://via.placeholder.com/300x200?text=No+Image';

          return (
            <img
              key={idx}
              src={imageUrl}
              alt={`صورة الإعلان ${idx + 1}`}
              style={{ height: '100px', width: 'auto', objectFit: 'contain', borderRadius: 5 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`container mt-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
      {/* رأس الصفحة */}
      <div className="row align-items-center mb-4 text-center text-lg-start">
        <div className="col-12 col-lg-6 mb-2 mb-lg-0">
          <h2 className="fw-bold">مرحباً بك في حراج سوريا</h2>
        </div>
        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end gap-2">
          {user ? (
            <span className="align-self-center fw-bold text-white bg-success px-2 py-1 rounded">
              أهلاً، {user.name}
            </span>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="btn btn-outline-success btn-sm">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>

      {/* حقل البحث */}
      <section className="mb-4">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="ابحث في الإعلانات..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" onClick={() => setCurrentPage(1)}>
            بحث
          </Button>
        </InputGroup>
      </section>

      {/* المدن */}
      <section className="mb-4">
        <h5 className="mb-2">المدن</h5>
        <div className="d-flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city.id}
              className={`btn btn-sm ${selectedCity === city.id ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => handleCityFilter(city.id)}
            >
              {city.name}
            </button>
          ))}
        </div>
      </section>

      {/* التصنيفات */}
      <section className="mb-4">
        <h5 className="mb-2">التصنيفات</h5>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => handleCategoryFilter(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* عرض الإعلانات */}
      <section className="mb-5">
        <h4 className="mb-3">الإعلانات</h4>
        <div className="row">
          {ads.length === 0 && !loading && (
            <p className={isDarkMode ? 'text-light' : 'text-muted'}>
              لا توجد إعلانات حالياً
            </p>
          )}
          {ads.map((ad) => (
           <div className="col-12 col-sm-6 col-md-4 mb-3" key={ad.id}>
  <div className={`card h-100 shadow-sm ${isDarkMode ? 'bg-secondary text-light' : ''}`}>
    {/* استخدام flex لترتيب الصورة على اليسار والتفاصيل على اليمين */}
    <div className="d-flex">
      {/* عرض الصورة على الجانب الأيسر */}
      <div className="card-img-wrapper">
        {renderImages(ad.images)}
      </div>

      {/* عرض التفاصيل على الجانب الأيمن */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{ad.title}</h5>
        <p className="card-text small">
          {ad.city?.name} - {ad.category?.name}
        </p>
        <p className="card-text fw-bold text-success">{ad.price} ل.س</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Link to={`/ads/${ad.id}`} className="btn btn-primary btn-sm">
            عرض التفاصيل
          </Link>
          <FavoriteButton
            adId={ad.id}
            isFavorited={favoriteIds.includes(ad.id)}
            onToggle={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  </div>
</div>

          ))}
        </div>

        {/* زر عرض المزيد */}
        {hasMore && (
          <div className="text-center mt-4">
            <Button
              variant={isDarkMode ? 'light' : 'secondary'}
              onClick={handleShowMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> جارٍ التحميل...
                </>
              ) : (
                'عرض المزيد'
              )}
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default BrowseAds;
