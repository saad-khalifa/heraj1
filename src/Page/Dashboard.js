import React from 'react';
import axios from 'axios';
import { FaUsers, FaBullhorn, FaThLarge, FaCity } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'http://localhost:8000';

function Dashboard() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/admin/dashboard/stats`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center mt-5">جارٍ التحميل...</div>;
  if (isError) return <div className="text-center mt-5 text-danger">فشل جلب الإحصائيات</div>;

  const pieData = [
    { name: 'المستخدمون', value: stats.users_count },
    { name: 'الإعلانات', value: stats.ads_count },
    { name: 'الأقسام', value: stats.categories_count },
    { name: 'المدن', value: stats.cities_count },
  ];

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">لوحة التحكم</h2>

      <div className="row text-white mb-4">
        <div className="col-md-3">
          <div className="card bg-primary shadow text-center">
            <div className="card-body">
              <FaUsers size={30} />
              <h5 className="mt-2">المستخدمون</h5>
              <h3>{stats.users_count}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success shadow text-center">
            <div className="card-body">
              <FaBullhorn size={30} />
              <h5 className="mt-2">الإعلانات</h5>
              <h3>{stats.ads_count}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning shadow text-center">
            <div className="card-body">
              <FaThLarge size={30} />
              <h5 className="mt-2">الأقسام</h5>
              <h3>{stats.categories_count}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger shadow text-center">
            <div className="card-body">
              <FaCity size={30} />
              <h5 className="mt-2">المدن</h5>
              <h3>{stats.cities_count}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h4>نسبة التوزيع</h4>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}

export default Dashboard;
