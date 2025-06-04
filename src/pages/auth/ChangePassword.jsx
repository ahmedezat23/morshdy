import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';

function ChangePassword() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMsg, setServerMsg] = useState('');
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      otp: '',
      newPassword: ''
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('OTP is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
    }),
    onSubmit: async (values) => {
      setServerMsg('');
      setError('');
      try {
        const response = await axios.put('https://morshdy-api.vercel.app/api/v1/auth/forget-password', {
          email,
          otp: values.otp,
          newPassword: values.newPassword
        });
        setServerMsg(response.data.message);
        
        if(response.data.success){
        navigate('/auth/login');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong.');
      }
    }
  });

  return (
    <div className="w-96 mt-10 p-6 bg-white/50 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">OTP</label>
          <input
            type="text"
            name="otp"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            onChange={formik.handleChange}
            value={formik.values.otp}
          />
          {formik.errors.otp && <p className="text-red-500 text-sm mt-1">{formik.errors.otp}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              className="w-full border border-gray-300 px-3 py-2 rounded pr-10"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#333] text-white py-2 rounded hover:bg-[#000] transition"
        >
          Change Password
        </button>
      </form>

      {serverMsg && <p className="text-green-600 mt-4 text-center">{serverMsg}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default ChangePassword;
