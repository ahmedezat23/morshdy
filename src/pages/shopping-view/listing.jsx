import { Button } from "@/components/ui/button";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster,toast } from "react-hot-toast";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductFilterPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // جلب التصنيفات
    fetch("http://localhost:3000/api/v1/category", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCategories(data.data));

    // جلب كل المنتجات
    fetch("http://localhost:3000/api/v1/product", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setFilteredProducts(data.products); // مبدأياً الكل
      });
  }, []);

  const handleFilter = (categoryId) => {
    console.log(categoryId);
    
    setSelectedCategory(categoryId);
    if (!categoryId) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.categoryId._id === categoryId);
      setFilteredProducts(filtered);
    }
  };
  console.log(filteredProducts);
    const handleAddtoCart = async (productId) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/cart/add', {
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

  const handleViewProduct = (id) => {
    navigate(`/tourist/${id}`);
  };
  

  return (
<div className="flex flex-col md:flex-row p-4">
  <Toaster position="top-left" />

  {/* Sidebar - التصنيفات */}
  <aside className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-4 border-b md:border-b-0 md:border-r">
    <h2 className="text-lg font-semibold mb-4">Categories</h2>
    <ul className="space-y-2">
      <li
        className={`cursor-pointer ${!selectedCategory ? "font-bold text-orange-600" : ""}`}
        onClick={() => handleFilter(null)}
      >
        All
      </li>
      {categories.map((cat) => (
        <li
          key={cat.id}
          className={`cursor-pointer ${selectedCategory === cat.id ? "font-bold text-orange-600" : ""}`}
          onClick={() => handleFilter(cat.id)}
        >
          {cat.name}
        </li>
      ))}
    </ul>
  </aside>

  {/* Products Grid */}
  <main className="w-full md:w-3/4 md:pl-6">
    <h2 className="text-xl font-semibold mb-4">
      {selectedCategory
        ? `Products in ${categories.find(c => c.id === selectedCategory)?.name}`
        : "All Products"}
    </h2>

    {filteredProducts.length === 0 ? (
      <p>No products found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="border rounded p-4 shadow">
            <img
              src={product.productImg}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{product.descripition}</p>
            <p className="font-bold text-orange-600">{product.price} EGP</p>

            <Box sx={{ p: "1rem" }}>
              <Button
                variant="outline"
                className="w-full mb-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => handleViewProduct(product._id)}
              >
                <FiEye className="mr-2" />
                View
              </Button>

              <Button
                onClick={() => handleAddtoCart(product._id)}
                className="w-full bg-[#EB8317] hover:bg-[#EB8317]/70 text-white hover:text-black"
              >
                <FiShoppingCart className="mr-2" />
                Add to cart
              </Button>
            </Box>
          </div>
        ))}
      </div>
    )}
  </main>
</div>

  );
};

export default ProductFilterPage;


