import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState(null);
  const [profit, setProfit] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [newProfit, setNewProfit] = useState('');
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  useEffect(() => {
    getUser();
    getProfit();
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setUser(data);
    } catch (err) {
      toast.error('Failed to load user data');
    }
  };

  const getProfit = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/profit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.percentage !== undefined) {
        setProfit(data.percentage);
        setNewProfit(data.percentage);
      }
    } catch {
      toast.error('Failed to fetch profit percentage');
    }
  };

  const handleUserUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      console.log(data);
      
      if (data.success) toast.success('User updated');
      else toast.error(data.error);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handlePasswordReset = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/reast-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) toast.success('Password reset successfully');
      else toast.error(data.message);
    } catch {
      toast.error('Reset failed');
    }
  };

  const handleProfitUpdate = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/profit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ percentage: parseFloat(newProfit) }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfit(data.percentage);
        toast.success('Profit percentage updated');
      } else toast.error(data.message);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-6 ">
      <ToastContainer position="top-right" />
      
      {/* 👇 CSS داخل الكومبوننت */}
      <style>{`
        .input {
          display: block;
          width: 100%;
          padding: 0.6rem;
          margin-bottom: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 0.4rem;
        }

        .btn {
          background-color: #4f46e5;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
        }

        .tab-btn {
          padding: 0.5rem 1rem;
          background: #eee;
          border-radius: 0.4rem;
          cursor: pointer;
          border: none;
        }

        .tab-btn.active {
          background: #4f46e5;
          color: white;
        }
      `}</style>

      <div className="flex gap-4 mb-6">
        <button className={`tab-btn ${activeTab === 'account' && 'active'}`} onClick={() => setActiveTab('account')}>Account</button>
        <button className={`tab-btn ${activeTab === 'password' && 'active'}`} onClick={() => setActiveTab('password')}>Password</button>
        <button className={`tab-btn ${activeTab === 'profit' && 'active'}`} onClick={() => setActiveTab('profit')}>Profit</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {activeTab === 'account' && user && (
          <div className="space-y-4">
            <input className="input" value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} placeholder="Full Name" />
            <input className="input" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
            <input className="input" value={user.mobile} onChange={(e) => setUser({ ...user, mobile: e.target.value })} placeholder="Mobile" />
            <input className="input" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} placeholder="Address" />
            <button className="btn" onClick={handleUserUpdate}>Update Profile</button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-4">
            <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
            <button className="btn" onClick={handlePasswordReset}>Reset Password</button>
          </div>
        )}

        {activeTab === 'profit' && (
          <div className="space-y-4">
            <p>Current Profit: <strong>{profit}%</strong></p>
            <input className="input" type="number" value={newProfit} onChange={(e) => setNewProfit(e.target.value)} placeholder="New Profit %" />
            <button className="btn" onClick={handleProfitUpdate}>Update Profit Percentage</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
