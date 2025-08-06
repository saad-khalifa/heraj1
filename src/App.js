import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Page/Home';
import BrowseAds from './Page/BrowseAds';
import { ThemeProvider } from './contexts/ThemeContext';
// import DetailAd from './Page/DetailAd';
// import AdsByCity from './Page/AdsByCity';
// import AdsByCategory from './Page/AdsByCategory';
import Messages from './Page/Messages';
import Dashboard from './Page/Dashboard';
import Login from './Page/Login';
import AdminDashboard from './Page/AdminDashboard';
import AdminUsers from './Page/AdminUsers';
import Users from './Page/Users';
import AdminAds from './Page/AdminAds';
import AdminCategories from './Page/AdminCategories';
import AdminCities from './Page/AdminCities';
import NewAd from './Page/NewAd';
import Favorites from './Page/Favorites';
import MyAds from './Page/MyAds';
import Navbar from './Page/Navbar';
import AdDetails from './Page/AdDetails';
import AdsList from './Page/AdsList';
import EditAd from './Page/EditAd';
import Register from './Page/Register';
import ProtectedRoute from './Page/ProtectedRoute';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Chat from './Page/Chat';
import AdminLayout from './Page/AdminLayout';
import AdminAdsApproval from './Page/AdminAdsApproval';
import Contact from './Page/Contact';
import ContactMessages from './Page/AdminMessage';
import MyContactMessages from './Page/MyContactMessages';
import AdminContactMessages from './Page/AdminMessage';
import AdminMessages from './Page/AdminMessage';
import MyTickets from './Page/MyTickets';
import Unauthorized from './Page/Unauthorized';
import UserMessages from './Page/UserMessages';
import AdminSendMessage from './Page/AdminSendMessage';
import About from './Page/About';
import AccountSettings from './Page/AccountSettings';
import Profile from './Page/Profile';
import NotificationsDropdown from './Page/NotificationsDropdown';
import 'react-toastify/dist/ReactToastify.css';
import AdminContactMessageDetails from './Page/AdminContactMessageDetails';
import Loading from './Componnent/Loading/Loading';
import Error404 from './Componnent/Error404/Err404';
function App() {

  const { loading, user } = useContext(AuthContext);
 
  return (
    <>
    {loading && <Loading/>}
    <ThemeProvider>
 <AuthProvider>
      
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="p-4">
            <Routes>
              {/* صفحات عامة */}
              <Route path="/" element={<Home />} />
              <Route path='/*' element={<Error404/>}/>
              <Route path="/browse-ads" element={<BrowseAds />} />
              <Route path="/ads/:id" element={<AdDetails />} />
              <Route path="/ads" element={<AdsList />} />
              <Route path="/edit-ad/:id" element={<EditAd />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='/about' element={<About/>}/>
<Route path="/my-contact/:id" element={<MyContactMessages />} />
<Route path='/account-settings' element={<AccountSettings/>}/>
<Route path="/profile" element={<Profile />} />
              <Route path='unauthorized' element={<Unauthorized/>}/>

                
                        

           <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* صفحات لوحة التحكم داخل AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approval" element={<AdminAdsApproval />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="cities" element={<AdminCities />} />
          <Route path="ads" element={<AdminAds />} />
          <Route path='admin_contact' element={<AdminMessages/>}/>
          <Route path='send' element={<AdminSendMessage/>}/>
        </Route>

              {/* صفحات محمية - نستخدم ProtectedRoute كـ wrapper */}
              <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat/:userId" element={<Chat />} />
                <Route path="/notifications" element={<NotificationsDropdown />} />
                <Route path="/ads/new" element={<NewAd />} />
                <Route path="/my-ads" element={<MyAds />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path='/userMessage' element={<UserMessages/>}/>

              </Route>
            </Routes>
          </main>
        </div>
     
    </AuthProvider>
    </ThemeProvider>

</>
  );
}

export default App;
