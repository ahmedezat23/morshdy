import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, LocateIcon, Edit, Save, X } from 'lucide-react';
import {toast,Toaster} from 'react-hot-toast';
const ShoppingAccount = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    
    setUser(userData);
    setEditableUser(userData);

    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://morshdy-api.vercel.app/api/v1/orders/user`,{
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
        const data = await res.json();
        console.log(data);
        
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    if (userData) fetchOrders();
  }, []);

  const handleChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://morshdy-api.vercel.app/api/v1/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editableUser),
      });

      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="l p-6">
     <Toaster position="top-left" />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Account Information</h2>

      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-10 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Tourist Info</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-lg bg-[#EB8317] flex items-center gap-2 text-white px-3 py-1 rounded hover:bg-[#EB8317]/70"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
  <div>
    <label className=" text-sm font-medium flex items-center gap-2">
      <User className="w-4 h-4" /> Full Name
    </label>
    <input
      type="text"
      name="fullName"
      value={editableUser.fullName || ''}
      onChange={handleChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
  <div>
    <label className=" text-sm font-medium flex items-center gap-2">
      <Mail className="w-4 h-4" /> Email
    </label>
    <input
      type="email"
      value={editableUser.email}
      disabled
      className="w-full p-2 border rounded mt-1 bg-gray-100 cursor-not-allowed"
    />
  </div>
  <div>
    <label className=" text-sm font-medium flex items-center gap-2">
      <Phone className="w-4 h-4" /> Mobile
    </label>
    <input
      type="text"
      name="mobile"
      value={editableUser.mobile || ''}
      onChange={handleChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
  <div>
    <label className=" text-sm font-medium flex items-center gap-2">
      <MapPin className="w-4 h-4" /> Address
    </label>
    <input
      type="text"
      name="address"
      value={editableUser.address || ''}
      onChange={handleChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
  <div>
    <label className=" text-sm font-medium flex items-center gap-2">
      <LocateIcon className="w-4 h-4" /> Zip Code
    </label>
    <input
      type="text"
      name="zipCode"
      value={editableUser.zipCode || ''}
      onChange={handleChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
</div>
          </div>

          {isEditing && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleUpdate}
                className="text-lg bg-[#EB8317] flex items-center gap-2 text-white px-3 py-1 rounded hover:bg-[#EB8317]/70"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditableUser(user);
                  setIsEditing(false);
                }}
                className="text-lg bg-[#000] flex items-center gap-2 text-white px-3 py-1 rounded hover:bg-[#000]/70"
              >
                <X className="w-4 h-4"  />
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      ) : (
        <p className="text-gray-500">You are not logged in.</p>
      )}

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Order History</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
{orders.map((order, idx) => (
  <div key={idx} className="bg-white border rounded-lg p-4 shadow-md mb-4">
    {/* عنوان الطلب */}
    <div className="flex justify-between items-center mb-3">
      <p>
        <span className="font-semibold">Order Date:</span>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p>
        <span className="font-semibold">Total Items:</span>{" "}
        {order.products.reduce((acc, item) => acc + item.quantity, 0)}
      </p>
    </div>

    {/* تفاصيل المنتجات */}
    <div className="mb-3">
      <p className="font-semibold mb-1">Order Details:</p>
      <ul className="pl-5 list-disc text-sm text-gray-800 space-y-1">
        {order.products.map((item, i) => (
          <li key={i}>
            <span className="font-medium">{item.product?.name}</span> — Quantity:{" "}
            {item.quantity} — Price: {item.product?.price} EGP
          </li>
        ))}
      </ul>
    </div>

    {/* السعر الاجمالي وحالة الدفع */}
    <div className="flex justify-between items-center text-sm font-medium">
      <p>
        <span className="text-gray-600">Total Price:</span>{" "}
        <span className="text-green-600">{order.totalPrice} EGP</span>
      </p>
      <p>
        <span className="text-gray-600">Payment Status:</span>{" "}
        <span className={`font-semibold ${order.StatusPaymentbyTourist === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
          {order.StatusPaymentbyTourist}
        </span>
      </p>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default ShoppingAccount;
