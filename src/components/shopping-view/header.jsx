import { useEffect, useRef, useState } from 'react';
import userImg from '../../assets/user.png';
import cartImg from '../../assets/cart.png';
import { useNavigate } from 'react-router-dom';
import { Brush, Scan } from 'lucide-react';

const ShoppingHeader = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user'));

  const cartRef = useRef(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCartItems(data.products || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setCartItems([]);
      }
    };

    fetchCartItems();
    const interval = setInterval(fetchCartItems, 2000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    navigate("/tourist/account");
  };

  const handleCartClick = () => {
    setShowCartDropdown(prev => !prev);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await fetch(`http://localhost:3000/api/v1/cart/update`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, quantity })
      });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const deleteItem = async (productId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/cart/`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      });
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:3000/api/v1/cart/clear`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 relative">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-extrabold text-[#EB8317]" onClick={() => { navigate("/tourist/home") }}>Morshdy</div>

        <div className="flex items-center gap-4">
          <div onClick={handleAccountClick} className="cursor-pointer hidden sm:block text-end">
            <p className="text-lg text-gray-700 font-medium">
              {user?.fullName || 'Guest'}
            </p>
          </div>

          <img
            src={user?.avatar || userImg}
            alt="User"
            onClick={handleAccountClick}
            className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
          />

          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <img src={cartImg} alt="Cart" className="w-7 h-7" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Dropdown */}
      {showCartDropdown && (
        <div
          ref={cartRef}
          className="absolute right-4 top-[70px] bg-white border shadow-lg rounded-md p-3 w-80 z-50 max-h-[300px] overflow-auto"
        >
          <h3 className="font-semibold mb-2 text-gray-700">My Orders</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No products in the cart.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center gap-2">
                    <div>
                      <p className="font-medium">{item.productId?.name}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >-</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >+</button>
                      </div>
                      <button
                        onClick={() => deleteItem(item.productId._id)}
                        className="text-xs text-red-500 mt-1 underline"
                      >
                        Remove
                      </button>
                    </div>
                    <img
                      src={item.productId?.productImg}
                      alt={item.productId?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </li>
                ))}
              </ul>

              <button
                onClick={clearCart}
                className="mt-3 w-full flex justify-center items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 py-1 rounded"
              >
                <Brush className="w-4 h-4" />
                Clear Cart
              </button>

              <button
                onClick={() => navigate('/tourist/checkout')}
                className="mt-2 w-full flex justify-center items-center gap-2 text-sm text-white bg-[#EB8317] hover:bg-[#EB8317]/70 py-1 rounded"
              >
                <Scan className="w-4 h-4" />
                Checkout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default ShoppingHeader;
