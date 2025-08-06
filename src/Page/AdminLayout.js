import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* الـ Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary px-3"
        style={{ height: 56 }}
      >
        {!isLargeScreen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-primary"
            aria-label="فتح قائمة الإدارة"
          >
            ☰
          </button>
        )}
        <span className="navbar-brand ms-3">لوحة التحكم</span>
      </nav>

      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        {/* الشريط الجانبي */}
        {(sidebarOpen || isLargeScreen) && (
          <aside
            className="bg-dark text-white p-3"
            style={{
              width: 250,
              height: isLargeScreen ? "auto" : "100vh",
              overflowY: "auto",
              position: isLargeScreen ? "relative" : "fixed",
              top: isLargeScreen ? 0 : 56,
              right: 0,
              left: isLargeScreen ? 0 : "auto",
              zIndex: 1100,
              transition: "transform 0.3s ease-in-out",
              transform:
                isLargeScreen || sidebarOpen
                  ? "translateX(0)"
                  : "translateX(100%)",
              boxShadow: !isLargeScreen
                ? "-2px 0 5px rgba(0,0,0,0.5)"
                : "none",
            }}
            onClick={handleLinkClick}
          >
            {!isLargeScreen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="btn btn-sm btn-light mb-3"
                aria-label="إغلاق القائمة"
              >
                ✕ إغلاق
              </button>
            )}
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/dashboard">
                  الرئيسية
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/users">
                  المستخدمون
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/categories">
                  الأقسام
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/cities">
                  المدن
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/ads">
                  الإعلانات
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/approval">
                  الموافقة
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  className="nav-link text-white"
                  to="/admin/admin_contact"
                >
                  رسائل التواصل
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/admin/send">
                  مراسلة العملاء
                </Link>
              </li>
            </ul>
          </aside>
        )}

        {/* خلفية مظللة */}
        {!isLargeScreen && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          ></div>
        )}

        {/* المحتوى */}
        <main
          className="p-4"
          style={{
            backgroundColor: "#6C757D",
            minHeight: "calc(100vh - 56px)",
            marginTop: isLargeScreen ? 0 : 56,
            width: isLargeScreen ? "calc(100% - 250px)" : "100%",
            transition: "width 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
