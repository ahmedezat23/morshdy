import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

const initialState = {
  fullName: '',
  mobile: '',
  address: '',
  email: '',
  password: '',
  zipCode: '',
};

function AddAdmin() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://morshdy-api.vercel.app/api/v1/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add admin");
      }

      toast({
        title: "Success",
        description: "Admin added successfully!",
      });

      setFormData(initialState);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:mx-36  p-6 bg-white rounded-xl shadow space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName", "mobile", "address", "email", "password", "zipCode"].map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="capitalize mb-1 font-medium">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-black text-white rounded hover:bg-[#283747] transition"
        >
          {loading ? "Submitting..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
}

export default AddAdmin;
