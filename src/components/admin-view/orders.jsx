import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function AdminOrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [modalType, setModalType] = useState(null); // "view" or "payment"

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);
  console.log(orders);
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">📦 Store Orders</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 text-md font-semibold">
              <tr>
                <th className="px-4 py-3 border">Order Details</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Total Price</th>
                <th className="px-4 py-3 border">Status Payment Shope</th>
                <th className="px-4 py-3 border">Status Payment Tourist</th>
                <th className="px-4 py-3 border">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`text-center ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
                >
<td className="border px-4 py-3">
  <button
    onClick={() => {
      setSelectedOrder(order);
      setModalType("view");
      setShowModal(true);
    }}
    className="bg-[#EB8317] hover:bg-[#EB8317]/70 text-white px-3 py-1 rounded text-sm"
  >
    View
  </button>
</td>
                  <td className="border px-4 py-3">{order.userId?.fullName}</td>
                  <td className="border px-4 py-3 text-green-600 font-semibold">{order.totalPrice} EGP</td>
                  <td className="border px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.StatusPaymentbyShope === 'UnPaid'
                          ? 'bg-yellow-100 text-yellow-800'
                          :'bg-green-100 text-green-800'
                          
                      }`}
                    >
                      {order.StatusPaymentbyShope}
                    </span>
                  </td>
                  <td className="border px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.StatusPaymentbyTourist == 'UnPaid'
                          ? 'bg-yellow-100 text-yellow-800'
                          :'bg-green-100 text-green-800'
                          
                      }`}
                    >
                      {order.StatusPaymentbyTourist}
                    </span>
                  </td>
<td className="border px-4 py-3">
  {order.StatusPaymentbyShope === 'Paid' ? (
    <span className="text-green-600 font-medium">Already Paid</span>
  ) : (
    <button
      onClick={() => {
        setSelectedOrder(order);
        setModalType("payment");
        setShowModal(true);
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
    >
      Mark as Paid by Shop
    </button>
  )}
</td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Details */}

{showModal && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl relative">
      {/* Close Button */}
      <button
        onClick={() => {
          setShowModal(false);
          setModalType(null);
        }}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
      >
        &times;
      </button>

      {/* Modal Title */}
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        {modalType === 'payment' ? 'Confirm Shop Payment' : 'Order Details'}
      </h2>

      {/* Order Details */}
      <div className="space-y-2 text-sm text-gray-700 max-h-60 overflow-y-auto mb-4">
        <p><strong>Customer:</strong> {selectedOrder.userId?.fullName}</p>
        <p><strong>Total Price:</strong> {selectedOrder.totalPrice} EGP</p>
        <hr />
        {selectedOrder.products?.map((item, index) => (
          <div key={index}>
            <p><strong>{item.product.name}</strong></p>
            <p>Price: {item.product.price} EGP</p>
            <p>Quantity: {item.quantity}</p>
            <hr />
          </div>
        ))}
      </div>

      {/* Payment Buttons only if modalType === 'payment' */}
      {modalType === 'payment' && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={async () => {
              try {
                await axios.put(
                  `http://localhost:3000/api/v1/admin/mark-store-paid/${selectedOrder._id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Order marked as paid by Shop');
                setShowModal(false);
                setModalType(null);
                fetchOrders();
              } catch (err) {
                toast.error('Failed to mark as paid');
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ✅ Confirm Payment
          </button>

          <button
            onClick={() => {
              setShowModal(false);
              setModalType(null);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  </div>
)}


    </div>
  );
}

export default AdminOrdersView;

