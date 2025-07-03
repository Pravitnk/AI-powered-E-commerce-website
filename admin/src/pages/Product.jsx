import React, { useState } from "react";
import AddProduct from "./AddProduct";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % selectedProduct.imagePreviews.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + selectedProduct.imagePreviews.length) %
        selectedProduct.imagePreviews.length
    );
  };

  return (
    <div className="p-4 w-full flex flex-col items-center space-y-6">
      <AddProduct onProductAdd={handleAddProduct} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {products.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer"
            onClick={() => {
              setSelectedProduct(product);
              setCurrentImageIndex(0);
            }}
          >
            <CardContent className="p-4 space-y-2">
              <img
                src={product.imagePreviews[0]}
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
                src={selectedProduct.imagePreviews[currentImageIndex]}
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
              <p>Sizes: {selectedProduct.sizes}</p>
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
