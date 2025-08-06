import React, { useState } from 'react';
import AdminDashboardStats from './AdminDashboardStats';
import AdminUsers from './AdminUsers';
import AdminAds from './AdminAds';
import AdminComplaints from './AdminComplaints';
import AdminCategories from './AdminCategories';
import AdminCities from './AdminCities';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const renderTab = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminDashboardStats />;
      case 'users':
        return <AdminUsers />;
      case 'ads':
        return <AdminAds />;
      case 'complaints':
        return <AdminComplaints />;
      case 'categories':
        return <AdminCategories />;
      case 'cities':
        return <AdminCities />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">لوحة تحكم المشرف</h2>

      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            الإحصائيات
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            المستخدمون
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'ads' ? 'active' : ''}`} onClick={() => setActiveTab('ads')}>
            الإعلانات
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
            الشكاوى
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            التصنيفات
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'cities' ? 'active' : ''}`} onClick={() => setActiveTab('cities')}>
            المدن
          </button>
        </li>
      </ul>

      {renderTab()}
    </div>
  );
};

export default AdminDashboard;
