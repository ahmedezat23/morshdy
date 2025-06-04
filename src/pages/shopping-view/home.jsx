import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "../../components/shopping-view/product-tile"
import bgImg from "../../assets/bg.png";

function ShoppingHome() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categoriesWithIcon, setCategoriesWithIcon] = useState([]);

  const token = localStorage.getItem("token");

  const [productList, productDetails] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setCategoriesWithIcon(data.data);
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    const fetchAllProducts = async () => {
      const res = await fetch("http://localhost:3000/api/v1/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);

      productDetails(data.products); // هنا كل المنتجات
    };
    fetchAllProducts()
    fetchCategories();
  }, []);



  function handleNavigateToListingPage(categoryItem, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [categoryItem.id] }));
    navigate(`/tourist/listing`);
  }



  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div>
        <img src={bgImg} className="opacity-100" />
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {categoryItem.icon && (
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  )}
                  <span className="font-bold">{categoryItem.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* All Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">

          {productList?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productList.map((product) => (
                <ShoppingProductTile
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              There are currently no products available
            </p>
          )}
        </div>
      </section>

    </div>
  );
}

export default ShoppingHome;
