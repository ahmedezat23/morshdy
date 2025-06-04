import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Box } from "@mui/material";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Toaster,toast } from "react-hot-toast";
function ShoppingProductTile({ product }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
    <>
    <Toaster position="top-left" />
        <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleViewProduct(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.productImg}
            alt={product?.name}
            className="w-full h-[200px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.name}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {product?.categoryId?.name}
            </span>
            <span className="text-[16px] font-bold text-[#e74c3c] text-muted-foreground">
              {product?.price} EGP
            </span>
          </div>
        </CardContent>
      </div>

      <Box sx={{ p: "1rem" }}>
        <Button
          variant="outline"
          className="w-full mb-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          onClick={() => handleViewProduct(product?._id)}
        >
          <FiEye className="mr-2" />
          View
        </Button>

        <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full bg-[#EB8317] hover:bg-[#EB8317]/70 text-white hover:text-black"
        >
          <FiShoppingCart className="mr-2" />
          Add to cart
        </Button>
      </Box>
    </Card>
    </>

  );
}

export default ShoppingProductTile;
