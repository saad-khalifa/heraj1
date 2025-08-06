import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} حراج سوريا - جميع الحقوق محفوظة</p>
        <small>تم التطوير بواسطة سعد الخليفة ❤️</small>
      </div>
    </footer>
  );
};

export default Footer;
