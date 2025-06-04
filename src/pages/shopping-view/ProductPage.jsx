import { Button } from "../../components/ui/button";
import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const ProductPage = () => {
  const { productId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userFeedback, setUserFeedback] = useState({ rating: 0, content: '' });
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // للتحكم في ظهور المودال

  useEffect(() => {
    // جلب بيانات المنتج
    fetch(`https://morshdy-api.vercel.app/api/v1/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProduct(data.data));

    // جلب التقييمات
    fetch(`https://morshdy-api.vercel.app/api/v1/review/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setFeedbacks(data.data));

    // تحقق اذا المستخدم اشترى المنتج للسماح بالتقييم
    fetch(`https://morshdy-api.vercel.app/api/v1/orders/checkPurchase?userId=${user._id}&productId=${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setHasPurchased(data.hasPurchased));
  }, [productId, token]);

  const handleAddtoCart = async (productId) => {
    try {
      const res = await fetch('https://morshdy-api.vercel.app/api/v1/cart/add', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product added to cart!");
      } else {
        toast.error(data?.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (userFeedback.rating < 1) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      const res = await fetch(`https://morshdy-api.vercel.app/api/v1/review/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userFeedback),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      // تحديث التقييمات
      const updatedFeedbacks = await fetch(`https://morshdy-api.vercel.app/api/v1/review/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());

      setFeedbacks(updatedFeedbacks.data);
      setUserFeedback({ rating: 0, comment: '' });
      setIsModalOpen(false); // اغلاق المودال بعد الارسال
      toast.success('Your rating has been sent for review.');
    } catch (error) {
      toast.error(error.message || 'Failed to submit feedback');
    }
  };

if (!product) {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );
}


  return (
    <div className="container mx-auto p-4 space-y-8">
      <Toaster position="top-left" />

      {/* Section 1: Product Details */}
      <section className="flex flex-col md:flex-row gap-6">
        <img src={product.productImage} alt={product.productName} className="w-full md:w-1/2 rounded" />

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
          <p className="mb-6">{product.descripition}</p>
          <p className="text-xl text-orange-600 font-semibold mb-4">{product.price} EGP</p>

          <div className="flex gap-4">
            <Button
              onClick={() => handleAddtoCart(product?._id)}
              className="w-full bg-[#EB8317] hover:bg-[#EB8317]/70 text-white hover:text-black"
            >
              <FiShoppingCart className="mr-2" />
              Add to cart
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Feedbacks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        {/* List previous feedback */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto border p-4 rounded">
          {feedbacks.length === 0 && <p>No reviews yet.</p>}
          {feedbacks.map((fb, i) => (
            <div key={i} className="border-b pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{fb.userName || 'Anonymous'}</span>
                <span className="text-yellow-500">{'★'.repeat(fb.rating)}</span>
              </div>
              <p>{fb.content}</p>
              <small className="text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>

        {/* Add new feedback */}
        {hasPurchased ? (
          <>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#EB8317] text-white px-4 py-2 rounded hover:bg-[#EB8317]/70 mb-4"
            >
              Add Review
            </Button>

            {/* Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-white rounded p-6 w-96"
                  onClick={e => e.stopPropagation()} // لمنع اغلاق المودال لما تضغط داخلها
                >
                  <h3 className="font-semibold mb-4 text-lg">Add Your Review</h3>
                  <div className="mb-4">
{/* Stars Rating UI */}
<div className="mb-2">
  <label className="block mb-1">Rating:</label>
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setUserFeedback({ ...userFeedback, rating: star })}
        className="text-yellow-500 text-xl focus:outline-none"
      >
        {userFeedback.rating >= star ? <FaStar /> : <FiStar />}
      </button>
    ))}
  </div>
</div>

                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Comment:</label>
                    <textarea
                      value={userFeedback.comment}
                      onChange={e => setUserFeedback({ ...userFeedback, content: e.target.value })}
                      rows={4}
                      className="w-full border rounded p-2"
                      placeholder="Write your feedback here..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitFeedback}
                      className="bg-[#EB8317] text-white px-4 py-2 rounded hover:bg-[#EB8317]/70"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">You must purchase this product to leave a review.</p>
        )}
      </section>
    </div>
  );
};

export default ProductPage;
