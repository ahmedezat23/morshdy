import  { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function FeedbackManager() {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      toast.error("Error fetching reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/review/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review accepted");
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to accept review");
      }
    } catch (error) {
      toast.error("Error accepting review");
    }
  };

  // const handleReject = async (id) => {
  //   if (!window.confirm("Are you sure you want to reject this review?")) return;
  //   try {
  //     const res = await fetch(`http://localhost:3000/api/v1/review/${id}`, {
  //       method: "DELETE",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       toast.success("Review rejected");
  //       fetchReviews();
  //     } else {
  //       toast.error(data.message || "Failed to delete review");
  //     }
  //   } catch (error) {
  //     toast.error("Error rejecting review");
  //   }
  // };
console.log(reviews);

  return (
    <div className="space-y-6 p-4">
      <ToastContainer position="top-right" />

      <h2 className="text-2xl font-bold text-center">Manage Feedback</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded shadow p-4 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.userName}</span>
              </div>
              <p className="text-gray-700">{review.content}</p>
              <p className="text-yellow-500 font-medium">Rating: {review.rating} / 5</p>
              {!review.verified && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAccept(review._id)}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <FaCheckCircle /> Accept
                  </button>
                  {/* <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <FaTimesCircle /> Reject
                  </button> */}
                </div>
              )}
              {review.verified && (
                <span className="inline-block text-sm text-green-700 font-semibold">Approved</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackManager;
