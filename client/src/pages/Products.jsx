import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/reducers/productSlice";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { products, loading, error } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  const [previewProduct, setPreviewProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const nextImage = () => {
    const images = getImageArray(previewProduct);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImageArray(previewProduct);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImageArray = (product) => {
    if (!product) return [];
    return [product.image1, product.image2, product.image3, product.image4];
  };

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
    <div className="p-4 w-full flex flex-col items-center space-y-6">
      {loading && (
        <div className="flex items-center space-x-2 text-lg text-orange-500">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading products...</span>
        </div>
      )}

      {error && (
        <p className="text-red-500 font-medium">
          Error loading products: {error}
        </p>
      )}

      {!loading && products.length === 0 && !error && (
        <p className="text-gray-500">No products available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {products.map((product) => (
          <Card
            key={product._id}
            className="cursor-pointer bg-gray-400 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
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
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm">₹{product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Preview Dialog */}
      {previewProduct && (
        <Dialog
          open={!!previewProduct}
          onOpenChange={(open) => {
            if (!open) setPreviewProduct(null);
          }}
        >
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewProduct.name}</DialogTitle>
            </DialogHeader>

            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2"
              >
                <FaCircleChevronLeft size={24} />
              </button>
              <img
                src={getImageArray(previewProduct)[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full max-h-[60vh] object-contain rounded-md"
              />
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2"
              >
                <FaCircleChevronRight size={24} />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <p>{previewProduct.description}</p>
              <p>
                Category: {previewProduct.category} /{" "}
                {previewProduct.subCategory}
              </p>
              <p>Sizes: {previewProduct.sizes.join(", ")}</p>
              <p>Price: ₹{previewProduct.price}</p>
              {previewProduct.bestSeller && (
                <p className="text-green-500 font-semibold">Best Seller</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Products;
