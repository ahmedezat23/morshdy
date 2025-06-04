import  { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, tourists: 0, stories: 0 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const [adminsRes, users] = await Promise.all([
          axios.get('https://morshdy-api.vercel.app/api/v1/admin/statistics', config),
          axios.get('https://morshdy-api.vercel.app/api/v1/user', config)
        ]);
        console.log(users.data.data);
        
        setStats({
          orders: adminsRes.data.orders,
          stories: adminsRes.data.stories,
          tourists: adminsRes.data.tourists,
        });
  
        setData(users.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-lg">Orders</h3>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </div>
            <div className="bg-green-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-lg">Tourists</h3>
              <p className="text-3xl font-bold">{stats.tourists}</p>
            </div>
            <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
              <h3 className="text-lg">Stores</h3>
              <p className="text-3xl font-bold">{stats.stories}</p>
            </div>
          </div>

          {/* Stores Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4">User data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">#</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border">{index + 1}</td>
                      <td className="py-2 px-4 border">{user.fullName}</td>
                      <td className="py-2 px-4 border">{user.role}</td>
                      <td className="py-2 px-4 border">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </>
      )}
    </div>
  );
}

export default AdminDashboard;
