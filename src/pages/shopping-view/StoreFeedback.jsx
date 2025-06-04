import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function StoreFeedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`https://morshdy-api.vercel.app/api/v1/review/shop/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.data);
      
      setReviews(res.data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load reviews');
      setLoading(false);
    }
  };

  const handleVerify = async (reviewId, status) => {
    try {
      await axios.put(
        `https://morshdy-api.vercel.app/api/v1/review/${reviewId}/verify`,
        { verified: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Review ${status ? 'approved' : 'rejected'}`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Product Feedback</h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded shadow p-4 bg-white flex flex-col justify-between"
            >
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">User:</span> {review.userName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Product:</span> {review.productName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Rating:</span> {review.rating} / 5
                </p>
                <p className="text-gray-800 mb-3">
                  <span className="font-semibold">Feedback:</span> {review.content}
                </p>
                <p className={`text-sm font-semibold mb-2 ${review.verified ? 'text-[#EB8317]' : 'text-red-600'}`}>
                  Status: {review.verified ? 'Approved' : 'Not Approved'}
                </p>
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                {!review.verified && (
                  <button
                    onClick={() => handleVerify(review.id, true)}
                    className="bg-[#EB8317] text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
                {review.verified && (
                  <button
                    onClick={() => handleVerify(review._id, false)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreFeedback;
