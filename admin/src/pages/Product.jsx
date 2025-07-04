import React, { useState } from "react";
import AddProduct from "./AddProduct";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Product = () => {
  const { products, loading, error } = useSelector((state) => state.product);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    const images = getImageArray(selectedProduct);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImageArray(selectedProduct);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImageArray = (product) => {
    if (!product) return [];
    return [product.image1, product.image2, product.image3, product.image4];
  };

  return (
    <div className="p-4 w-full flex flex-col items-center space-y-6">
      <AddProduct />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {products.map((product) => (
          <Card
            key={product._id}
            className="cursor-pointer"
            onClick={() => {
              setSelectedProduct(product);
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

      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>

            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2"
              >
                <FaCircleChevronLeft size={24} />
              </button>
              <img
                src={getImageArray(selectedProduct)[currentImageIndex]}
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
              <p>{selectedProduct.description}</p>
              <p>
                Category: {selectedProduct.category} /{" "}
                {selectedProduct.subCategory}
              </p>
              <p>Sizes: {selectedProduct.sizes.join(", ")}</p>
              <p>Price: ₹{selectedProduct.price}</p>
              {selectedProduct.bestSeller && (
                <p className="text-green-500 font-semibold">Best Seller</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Product;
