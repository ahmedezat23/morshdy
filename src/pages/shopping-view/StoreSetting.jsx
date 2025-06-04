import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';

function StoreSetting() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [storeData, setStoreData] = useState({
    nameShope: '',
    ownerShope: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [changingPassword, setChangingPassword] = useState(false);

  const fetchStoreData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/shop/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStoreData(res.data.data);
    } catch (err) {
      toast.error("Failed to load store data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateStore = async () => {
    try {
      await axios.put(`http://localhost:3000/api/v1/shop/${user._id}`, storeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store updated successfully");
      setIsEditing(false);

      // جلب البيانات الجديدة بعد التحديث
      fetchStoreData();
    } catch (err) {
      toast.error("Failed to update store");
    }
  };

  const handleCancel = () => {
    setStoreData(originalData);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/shop/${user._id}/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
    } catch (err) {
      console.log(err);
      
      toast.error("Failed to change password");
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  return (
    <div className="p-6 space-y-2">
      <Toaster />
      {/* Store Info */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Store Information</h2>
          {!isEditing && (
            <button
              onClick={() => {
                setOriginalData({ ...storeData });
                setIsEditing(true);
              }}
              className="bg-[#EB8317] text-white px-4 py-1.5 rounded shadow hover:bg-blue-700 transition flex items-center gap-1 justify-center"
            >
              <FaEdit />
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="nameShope"             // تم التعديل هنا
            placeholder="Store Name"
            value={storeData?.nameShope}
            onChange={handleChange}
            disabled={!isEditing}
            className={`border p-2 rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
          <input
            type="text"
            name="ownerShope"            // تم التعديل هنا
            placeholder="Phone"
            value={storeData?.ownerShope}
            onChange={handleChange}
            disabled={!isEditing}
            className={`border p-2 rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleUpdateStore}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="bg-[#EB8317] text-white px-4 py-1.5 rounded shadow hover:bg-blue-700 transition flex items-center gap-1 justify-center"
            >
              <FaEdit />
              Edit
            </button>
          )}
        </div>

        {changingPassword ? (
          <div className="grid grid-cols-1 gap-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="border p-2 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleChangePassword}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setChangingPassword(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">•••••••• (hidden)</p>
        )}
      </div>
    </div>
  );
}

export default StoreSetting;
