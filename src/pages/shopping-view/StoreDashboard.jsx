import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function StoreDashboard() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token")
const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    productImg: '',
    descripition: '',
    price: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`https://morshdy-api.vercel.app/api/v1/shop/products/${user._id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const fetchCount = async () => {
    try {
      const res = await axios.get(`https://morshdy-api.vercel.app/api/v1/shop/products/${user._id}/count`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load product count");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://morshdy-api.vercel.app/api/v1/category',{
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://morshdy-api.vercel.app/api/v1/product/${selectedProduct._id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      fetchProducts();
      fetchCount();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleSubmitAddProduct = async () => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };
      console.log(formData);
      

      await axios.post(`https://morshdy-api.vercel.app/api/v1/product/${user._id}`, payload,{
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product added successfully");
      setShowAddModal(false);
      setFormData({
        categoryId: '',
        name: '',
        productImg: '',
        descripition: '',
        price: ''
      });
      fetchProducts();
      fetchCount();
    } catch (err) {
      console.log(err);
      
      toast.error("Failed to add product");
    }
  };

const handleSubmitEditProduct = async () => {
  try {
    const payload = {
      ...formData,
      price: Number(formData.price),
    };
    await axios.put(`https://morshdy-api.vercel.app/api/v1/product/${selectedProduct._id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Product updated successfully");
    setShowEditModal(false);
    setFormData({
      categoryId: '',
      name: '',
      productImg: '',
      descripition: '',
      price: ''
    });
    fetchProducts();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update product");
  }
};


  useEffect(() => {
    fetchProducts();
    fetchCount();
    fetchCategories();
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6" >
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Store Dashboard</h1>
      <div className="mb-4">
        <span className="text-gray-700">Product count: </span>
        <span className="font-semibold">{count}</span>
      </div>
      <div className='flex justify-end'>
        <button
        onClick={() => setShowAddModal(true)}
        className="bg-[#EB8317] text-white px-4 py-2 rounded mb-4 flex items-center gap-2"
      >
        <FaPlus />
        Add New Product
      </button>
      </div>
<div className="overflow-x-auto rounded shadow">
  <table className="min-w-full table-auto border border-gray-200">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-4 py-2 border">Image</th>
        <th className="px-4 py-2 border">Name</th>
        <th className="px-4 py-2 border">Price (EGP)</th>
        <th className="px-4 py-2 border">Description</th>
        <th className="px-4 py-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product._id} className="text-center">
          <td className="border px-4 py-2">
            <img
              src={product.productImg}
              alt={product.name}
              className="w-16 h-16 object-cover mx-auto rounded"
            />
          </td>
          <td className="border px-4 py-2">{product.name}</td>
          <td className="border px-4 py-2">{product.price}</td>
          <td className="border px-4 py-2 max-w-sm break-words">{product.descripition}</td>
          <td className="px-4 py-2 space-x-1 flex justify-center items-center mt-3">
<button
  onClick={() => {
    setSelectedProduct(product);
    setFormData({
      categoryId: product.categoryId,
      name: product.name,
      productImg: product.productImg,
      descripition: product.descripition,
      price: product.price
    });
    setShowEditModal(true);
  }}
  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
>
  <FaEdit />
  Edit
</button>

            <button
              onClick={() => {
                setSelectedProduct(product);
                setShowDeleteModal(true);
              }}
               className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 justify-center"
            >
              <FaTrash />
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete <span className="font-semibold">{selectedProduct.name}</span>?</p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="productImg"
                placeholder="Image URL"
                value={formData.productImg}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <textarea
                name="descripition"
                placeholder="Description"
                value={formData.descripition}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleSubmitAddProduct}
                  className="bg-[#EB8317] text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
{showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
      <h3 className="text-lg font-bold mb-4">Edit Product</h3>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="productImg"
          placeholder="Image URL"
          value={formData.productImg}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="descripition"
          placeholder="Description"
          value={formData.descripition}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleSubmitEditProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default StoreDashboard;
