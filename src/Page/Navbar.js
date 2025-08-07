import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [adminMessagesCount, setAdminMessagesCount] = useState(0);
  const [contactUnreadCount, setContactUnreadCount] = useState(0);
  const [userMessagesCount, setUserMessagesCount] = useState(0);

  const fetchAdminUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8000/api/admin-messages/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminMessagesCount(res.data.unread_count || 0);
    } catch (err) {
      console.error('فشل في جلب عداد رسائل الإدارة:', err);
    }
  };

  const fetchContactUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8000/api/contact-messages/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContactUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error('فشل في جلب عداد رسائل التواصل:', err);
    }
  };

  const fetchUserMessagesCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8000/api/messages/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserMessagesCount(res.data.unread_count || 0);
    } catch (err) {
      console.error('فشل في جلب عداد رسائل المستخدمين:', err);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    const updateCounts = async () => {
      await fetchAdminUnreadCount();
      await fetchContactUnreadCount();
      await fetchUserMessagesCount();
    };
    updateCounts();
    const interval = setInterval(updateCounts, 10000);
    return () => clearInterval(interval);
  }, [user, token]);

  useEffect(() => {
    const markAdminMessagesAsRead = async () => {
      if (location.pathname === '/userMessage' && adminMessagesCount > 0) {
        try {
          await axios.post(
            'http://localhost:8000/api/admin-messages/mark-all-read',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAdminMessagesCount(0);
        } catch (err) {
          console.error('فشل في تعليم رسائل الإدارة كمقروءة:', err);
        }
      }
    };
    markAdminMessagesAsRead();
  }, [location.pathname, adminMessagesCount, token]);

  useEffect(() => {
    const markContactMessagesAsRead = async () => {
      if (location.pathname === '/my-tickets' && contactUnreadCount > 0) {
        try {
          await axios.post(
            'http://localhost:8000/api/contact-messages/mark-all-read',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setContactUnreadCount(0);
        } catch (err) {
          console.error('فشل في تعليم رسائل التواصل كمقروءة:', err);
        }
      }
    };
    markContactMessagesAsRead();
  }, [location.pathname, contactUnreadCount, token]);

  useEffect(() => {
    const markUserMessagesAsRead = async () => {
      if (location.pathname.startsWith('/messages/chat/')) {
        const otherUserId = location.pathname.split('/').pop();
        if (userMessagesCount > 0) {
          try {
            await axios.post(
              `http://localhost:8000/api/messages/mark-as-read/${otherUserId}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserMessagesCount(0);
          } catch (err) {
            console.error('فشل في تعليم رسائل المستخدمين كمقروءة:', err);
          }
        }
      }
    };
    markUserMessagesAsRead();
  }, [location.pathname, userMessagesCount, token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinkClass = (isActive) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-${theme === 'dark' ? 'dark' : 'light'} bg-${
        theme === 'dark' ? 'dark' : 'primary'
      }`}
    >
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold" to="/">
          حراج سوريا
        </Link>

        {/* العناصر تظهر فقط في الشاشات الصغيرة */}
         
  <div className="d-flex d-lg-none align-items-center gap-2">


    {/* رسائل المستخدمين */}
    <Link to="/messages" className="position-relative btn btn-outline-light btn-sm d-flex align-items-center justify-content-center p-2" title="رسائل">
      <i className="bi bi-envelope-fill fs-6"></i>
      {userMessagesCount > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: '0.6rem' }}
        >
          {userMessagesCount}
        </span>
      )}
    </Link>

    {/* الإشعارات */}
    <div className="d-flex align-items-center justify-content-center">
      <NotificationsDropdown />
    </div>

    {/* تغيير الثيم */}
    <button
      onClick={toggleTheme}
      className="btn btn-outline-light btn-sm d-flex align-items-center justify-content-center p-2"
      title="تغيير الثيم"
      style={{ fontSize: '1rem', lineHeight: 1 }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>

    {/* الملف الشخصي */}
    <Link to="/profile" title="الملف الشخصي" className="d-flex align-items-center justify-content-center">
      <img
        src={
        user && user.profile_image
            ? `http://localhost:8000/storage/${user.profile_image}`
            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        }
        alt="Profile"
        className="rounded-circle"
        style={{
          width: '30px',
          height: '30px',
          objectFit: 'cover',
          border: '2px solid #fff',
          cursor: 'pointer',
        }}
      />
    </Link>
  </div>



        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="تبديل التنقل"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mt-2 mt-lg-0" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
                الرئيسية
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/browse-ads" className={({ isActive }) => getNavLinkClass(isActive)}>
                تصفح الإعلانات
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ads/new" className={({ isActive }) => getNavLinkClass(isActive)}>
                إضافة إعلان
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/favorites" className={({ isActive }) => getNavLinkClass(isActive)}>
                المفضلة
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my-ads" className={({ isActive }) => getNavLinkClass(isActive)}>
                إعلاناتي
              </NavLink>
            </li>

            
              <>
                <li className="nav-item position-relative">
                  <NavLink to="/userMessage" className={({ isActive }) => getNavLinkClass(isActive)}>
                    رسائل الإدارة
                    {adminMessagesCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {adminMessagesCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item position-relative">
                  <NavLink to="/my-tickets" className={({ isActive }) => getNavLinkClass(isActive)}>
                    رسائل التواصل
                    {contactUnreadCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {contactUnreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                {/* العناصر تظهر هنا فقط في الشاشات الكبيرة */}
                <li className="nav-item d-none d-lg-flex align-items-center gap-2">
                   <Link to="/messages" className="position-relative btn  btn-sm">
                    رسائل المستخدمين
                    {userMessagesCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {userMessagesCount}
                      </span>
                    )}
                  </Link>
                  <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => getNavLinkClass(isActive)}>
                تواصل معنا
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => getNavLinkClass(isActive)}>
                من نحن
              </NavLink>
            </li>

            {user?.is_admin && (
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className={({ isActive }) => getNavLinkClass(isActive)}>
                  لوحة التحكم
                </NavLink>
              </li>
            )}
                  <NotificationsDropdown />
                 
                  <button onClick={toggleTheme} className="btn btn-outline-light btn-sm" title="تغيير الثيم">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
<Link
  to={user ? "/profile" : "/login"}
  title="الملف الشخصي"
  style={{ marginLeft: '10px' }}
>
  <img
    src={
      user && user.profile_image
        ? `http://localhost:8000/storage/${user.profile_image}`
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }
    alt="Profile"
    className="rounded-circle"
    style={{
      width: '35px',
      height: '35px',
      objectFit: 'cover',
      border: '2px solid #fff',
      cursor: 'pointer',
    }}
  />
</Link>

                </li>
              </>
            
{user?.is_admin && (
    <div className='d-flex d-lg-none'>
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className={({ isActive }) => getNavLinkClass(isActive)}>
                  لوحة التحكم
                </NavLink>
              </li>
              </div>
            )}
            <div className="d-flex d-lg-none align-items-center gap-2">
            {user ? (
              <button onClick={handleLogout} style={{ backgroundColor:'red' }} className="btn btn-outline-light btn-sm" title="تسجيل الخروج">
                تسجيل الخروج
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  تسجيل دخول
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-sm">
                  حساب جديد
                </Link>
              </>
            )}
          </div>
            
          </ul>

          {/* تسجيل الدخول والخروج */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm" title="تسجيل الخروج">
                تسجيل الخروج
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  تسجيل دخول
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-sm">
                  حساب جديد
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
