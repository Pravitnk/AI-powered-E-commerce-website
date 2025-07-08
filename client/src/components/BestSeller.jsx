import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { getProducts } from "@/redux/reducers/productSlice";

const BestSeller = () => {
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [previewProduct, setPreviewProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bestSellingProducts = products.filter(
    (product) => product.bestSeller === true
  );

  const fetchProducts = async () => {
    try {
      await dispatch(getProducts());
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-800 bg-gray-100 py-10 px-4 flex flex-col items-center pt-16">
      <h1 className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">
        Best Selling Products
      </h1>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {bestSellingProducts.map((product) => (
            <Card
              key={product._id}
              className="w-full max-w-xs cursor-pointer bg-gray-200 dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-[103%] duration-300"
              onClick={() => {
                setPreviewProduct(product);
                setCurrentImageIndex(0);
              }}
            >
              <CardContent className="p-4 space-y-2">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  ₹{product.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
