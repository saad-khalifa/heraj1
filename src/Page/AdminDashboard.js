import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import { PieChart, BarChart } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // تأكد من المسار الصحيح

const PieChartFill = () => <PieChart color="#0d6efd" size={24} />;
const BarChartFill = () => <BarChart color="#198754" size={24} />;
const COLORS = ['#0d6efd', '#198754', '#fd7e14'];

function AdminDashboard() {
  const [stats, setStats] = useState({
    ads_count: 0,
    users_count: 0,
    categories_count: 0,
  });

  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_admin) {
        navigate('/unauthorized'); // صفحة غير مصرّح بها
      } else {
        fetchStats();
      }
    }
  }, [user, loading]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  const data = [
    { name: 'الإعلانات', value: stats.ads_count },
    { name: 'المستخدمين', value: stats.users_count },
    { name: 'الأقسام', value: stats.categories_count },
  ];

  if (loading) {
    return <div className="container py-5"><p>جاري التحقق...</p></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">لوحة تحكم المشرف</h2>

      <div className="row gy-4">
        {/* الرسم البياني الدائري */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex align-items-center">
              <PieChartFill className="me-2" />
              <h5 className="mb-0">الرسم البياني الدائري (Pie Chart)</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer>
                <RechartsPieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* الرسم البياني العمودي */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex align-items-center">
              <BarChartFill className="me-2" />
              <h5 className="mb-0">الرسم البياني العمودي (Bar Chart)</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer>
                <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#198754" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default AdminDashboard;
