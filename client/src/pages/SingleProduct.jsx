import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCart } from "@/redux/reducers/cartSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const SingleProduct = () => {
  const { id } = useParams(); // Grab product ID from URL
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    try {
      console.log(product._id, +"1" + selectedSize);
      await dispatch(
        addToCart({
          productId: product._id,
          qty: 1,
          size: selectedSize,
        })
      );
      toast.success(`${product.name} is added to cart successfully...`);
    } catch (error) {
      toast.error(`Error occures while adding product to cart: ${error}`);
      console.error(`Error occures while adding product to cart: ${error}`);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.image1) {
      setCurrentImage(product.image1);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-300 dark:bg-gray-900 py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-xl" />
            <div className="flex gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-md" />
                ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }
  if (!product)
    return <div className="text-center p-10">Product not found.</div>;
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Images */}
        <div>
          <img
            src={currentImage}
            alt="Main"
            className="w-full h-[400px] object-cover rounded-xl shadow-md"
          />
          <div className="flex gap-4 mt-4">
            {[
              product.image1,
              product.image2,
              product.image3,
              product.image4,
            ].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                onClick={() => setCurrentImage(img)}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                  currentImage === img
                    ? "border-orange-500 scale-105"
                    : "border-transparent hover:border-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {product.name}
            </h1>
            <p className="text-lg text-orange-500 font-semibold mt-1">
              ₹{product.price}
            </p>
            {product.bestSeller && (
              <span className="inline-flex items-center gap-1 mt-2 text-sm text-green-600 font-semibold">
                <FaStar className="text-yellow-400" /> Best Seller
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">
              Select Size:
            </p>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition-all font-medium ${
                    selectedSize === size
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            className={`w-full text-lg py-6 mt-4 ${
              !selectedSize ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            Add to Cart
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Category: {product.category} / {product.subCategory}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
