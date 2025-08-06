import React, { useEffect, useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axiosConfig';
import { Dropdown, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

// API functions
const fetchNotifications = async () => {
  const res = await axios.get('/notifications');
  return res.data;
};

const markAllAsReadApi = async () => {
  await axios.post('/notifications/mark-all-read');
};

const markOneAsReadApi = async (id) => {
  await axios.post(`/notifications/${id}/mark-as-read`);
};

const deleteNotificationApi = async (id) => {
  await axios.delete(`/notifications/${id}`);
};

const NotificationsDropdown = ({ onCountsChange }) => {
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mutationMarkAllRead = useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => fetchAndSetNotifications(),
  });

  const mutationMarkOneRead = useMutation({
    mutationFn: markOneAsReadApi,
    onSuccess: () => fetchAndSetNotifications(),
  });

  const mutationDelete = useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => fetchAndSetNotifications(),
  });

  const fetchAndSetNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setIsLoading(false);
    } catch (error) {
      console.error('فشل في جلب الإشعارات:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetNotifications();
    const interval = setInterval(() => {
      fetchAndSetNotifications();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let adminMessages = 0;
    let tickets = 0;
    let userMessages = 0;

    notifications.forEach((n) => {
      const d = n.data?.message || n.data || {};
      if (n.type === 'App\\Notifications\\AdminMessageNotification') adminMessages++;
      else if (n.type === 'App\\Notifications\\TicketReplyNotification') tickets++;
      else if (n.type === 'App\\Notifications\\NewMessageNotification') userMessages++;
    });

    onCountsChange?.({ adminMessages, tickets, userMessages });
  }, [notifications, onCountsChange]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const renderNotification = (notif) => {
    const rawData = notif.data || {};
    const data = typeof rawData.message === 'object' ? rawData.message : rawData;


    let mainTitle = 'إشعار';
    let mainContent = 'لديك إشعار جديد';
    let linkTo = data.link || null;

    if (data.ad_status === 'approved') {
      mainTitle = '✅ تمت الموافقة على إعلانك';
      mainContent = 'إعلانك تم الموافقة عليه ويمكنك الآن عرضه.';
    } else if (data.ad_status === 'rejected') {
      mainTitle = '❌ تم رفض إعلانك';
      mainContent = 'للأسف، إعلانك لم يتم الموافقة عليه.';
    } else if (notif.type === 'App\\Notifications\\NewMessageNotification' && data.sender_id) {
      mainTitle = '✉️ رسالة جديدة من مستخدم';
      mainContent = data.content || 'لديك رسالة جديدة.';
    } else if (notif.type === 'App\\Notifications\\AdminMessageNotification') {
      mainTitle = '📩 رسالة من الإدارة';
      mainContent = data.content || 'لديك رسالة من الإدارة.';
    } else if (notif.type === 'App\\Notifications\\TicketReplyNotification') {
      mainTitle = '🎫 رد الإدارة على تذكرتك';
      mainContent = data.reply_message || 'تم الرد على تذكرتك.';
    }

    if (!linkTo) {
      if (data.sender_id) linkTo = `/userMessage`;
      else if (data.ad_id) linkTo = `/ads/${data.ad_id}`;
      else if (data.ticket_id) linkTo = `/my-contact/${data.ticket_id}`;
    }

    return (
      <div
  key={notif.id}
  className={`dropdown-item d-flex justify-content-between align-items-start ${!notif.read_at ? 'fw-bold' : ''}`}
  style={{
    whiteSpace: 'normal',
    color: isDark ? '#ddd' : undefined,
    backgroundColor: isDark && !notif.read_at ? '#333' : undefined,
  }}
  onMouseEnter={(e) => {
    // عند المرور بالماوس، يمكنك تغيير الخلفية إذا أردت
    e.target.style.backgroundColor = isDark ? '#444' : '#f8f9fa'; // تغيير الخلفية عند الـ hover
    e.target.style.color = isDark ? '#fff' : '#000'; // تغيير اللون عند الـ hover
  }}
  onMouseLeave={(e) => {
    // إعادة الخلفية إلى الوضع الطبيعي عند مغادرة الماوس
    e.target.style.backgroundColor = isDark && !notif.read_at ? '#333' : '';
    e.target.style.color = isDark ? '#ddd' : ''; // إعادة اللون إلى اللون الأساسي
  }}
>
  <div className="me-2">
    <div>{mainTitle}</div>
    <small className={`d-block mb-1 ${isDark ? 'text-light' : 'text-muted'}`}>{mainContent}</small>
    {linkTo && (
      <Link to={linkTo} className={`btn btn-sm btn-link p-0 ${isDark ? 'text-info' : ''}`}>
        الانتقال
      </Link>
    )}
  </div>
  <div className="d-flex flex-column gap-1">
    {!notif.read_at && (
      <button
        className="btn btn-sm btn-outline-success py-0 px-1"
        title="تعليم كمقروء"
        onClick={() => mutationMarkOneRead.mutate(notif.id)}
      >
        ✅
      </button>
    )}
    <button
      className="btn btn-sm btn-outline-danger py-0 px-1"
      title="حذف الإشعار"
      onClick={() => mutationDelete.mutate(notif.id)}
    >
      🗑
    </button>
  </div>
</div>

    );
  };

  return (
    <Dropdown show={show} onToggle={() => setShow(!show)} className="me-2 position-relative">
      <Dropdown.Toggle as="div" onClick={() => setShow(!show)} style={{ cursor: 'pointer' }}>
        <i className="bi bi-bell-fill fs-5" style={{ color: '#ffc107' }}></i>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: '350px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: isDark ? '#222' : undefined,
          color: isDark ? '#fff' : undefined,
        }}
        align="end"
      >
        <div className="d-flex justify-content-end px-2 mb-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => mutationMarkAllRead.mutate()}
            disabled={unreadCount === 0 || mutationMarkAllRead.isLoading}
          >
            {mutationMarkAllRead.isLoading ? 'جاري التعليم...' : 'تعليم الكل كمقروء'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> جاري التحميل...
          </div>
        ) : notifications.length === 0 ? (
          <Dropdown.Item disabled className="text-center">
            لا توجد إشعارات
          </Dropdown.Item>
        ) : (
          notifications.map(renderNotification)
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
