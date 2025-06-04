import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function VerifyAccount() {
  const {email} = useParams();
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/v1/auth/verify-otp', {
        email,
        otp:otpCode
      },{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('✅ Account verified successfully!');
      setTimeout(() => {
        navigate(`/auth/login`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Verification failed. Please check your code or email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="w-full max-w-md bg-white/50 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#000] mb-6">🔐 Verify Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="w-full bg-[#333] text-white font-bold py-3 rounded hover:bg-[#000] transition"
          >
            Verify Account
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyAccount;
