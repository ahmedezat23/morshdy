import { Captions } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast,Toaster} from 'react-hot-toast';

const ShoppingCheckout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data.products || []);

      const totalPrice = data.products?.reduce(
        (sum, item) => sum + item.productId?.price * item.quantity,
        0
      );
      setTotal(totalPrice || 0);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await fetch(`http://localhost:3000/api/v1/cart/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      fetchCartItems(); // reload updated data
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const deleteItem = async (productId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      fetchCartItems(); // reload updated data
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };


const handleOrderSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    const userCart = cartItems.map(item => ({
      product: item.productId._id,
      quantity: item.quantity
    }));

    const total = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    const res = await fetch("http://localhost:3000/api/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        products: userCart,
        totalPrice: total
      })
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Order submitted successfully!");
      navigate("/tourist/home");
    } else {
      toast.error("Order failed: " + data.message);
    }
  } catch (err) {
    console.error("Order submit error:", err);
    toast.error("Failed to submit order");
  }
};


  return (
    <div className="container mx-auto px-4 py-6">
     <Toaster position="top-left" />

      <h2 className="text-2xl font-bold mb-6 text-gray-700">Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* المنتجات */}
          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{item.productId?.name}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    ${(item.productId?.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.productId._id)}
                      className="text-sm text-red-500 underline ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <img
                  src={item.productId?.productImg}
                  alt={item.productId?.name}
                  className="w-14 h-14 object-cover rounded"
                />
              </div>
            ))}
          </div>

          {/* الملخص */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <p className="flex justify-between mb-2 text-gray-700">
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </p>
            <p className="flex justify-between text-gray-700 font-medium">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </p>

            <button
              onClick={handleOrderSubmit}
              className="mt-4 w-full bg-[#EB8317] flex justify-center gap-3 text-white py-2 rounded hover:bg-[#EB8317]/70 transition"
            >
              <Captions />
              Submit Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCheckout;


