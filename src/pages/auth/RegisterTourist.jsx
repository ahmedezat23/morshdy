import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // ✅ import toast

function TouristRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    address: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'userImg') {
      const file = files[0];
      setFormData({ ...formData, userImg: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      const res = await axios.post('https://morshdy-api.vercel.app/api/v1/auth/register', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('✅ Tourist registered successfully!');
      console.log(res.data);
      setTimeout(() => {
        navigate(`/auth/${formData.email}/verifyRgister`);
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('❌ Failed to register. Please check your data.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  to-blue-200 p-6">
        <Toaster position="top-center" reverseOrder={false} /> 
      <div className="w-full max-w-3xl bg-white/50 shadow-2xl rounded-2xl p-10 transition-all duration-300 hover:shadow-[#333]">
        <h2 className="text-3xl font-bold text-center text-[#333] mb-8">🧳 Tourist Registration</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+123456789"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="City, Street..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="12345"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-[#333] text-white font-bold rounded-lg hover:bg-[#000] transition duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default TouristRegister;
