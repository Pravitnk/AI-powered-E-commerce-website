import React, { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { deleteProduct, getProducts } from "@/redux/reducer/productSlice";
import RemoveProducts from "./RemoveProducts";
import toast from "react-hot-toast";
import EditProduct from "./EditProduct";

const Product = () => {
  const { products, loading, error } = useSelector((state) => state.product);
  console.log(products);

  const dispatch = useDispatch();

  const [previewProduct, setPreviewProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [productToEdit, setProductToEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete._id)).unwrap();
      setShowConfirm(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

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
      <AddProduct />

      <h1 className="lg:text-4xl font-bold tracking-wide md:text-3xl sm:text-2xl">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {products.map((product) => (
          <Card
            key={product._id}
            className="cursor-pointer bg-gray-400 dark:bg-gray-800 hover:shadow-lg transition-all duration-400 hover:scale-[103%]"
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

              {/* Buttons: prevent preview when clicked */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">{product.name}</span>
                <div className="space-x-2">
                  <Button
                    className="btn-primary cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit logic
                      setProductToEdit(product);
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductToDelete(product);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
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

      {/* Delete Confirmation Dialog */}
      <RemoveProducts
        open={showConfirm}
        setOpen={(val) => {
          setShowConfirm(val);
          if (!val) setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />

      {/* edit Confirmation Dialog */}
      {/* Edit Product Dialog (Component logic will come later) */}
      <EditProduct
        open={showEdit}
        loading={loading}
        error={error}
        setOpen={(val) => {
          setShowEdit(val);
          if (!val) setProductToEdit(null);
        }}
        product={productToEdit}
      />

      {/* <section className="min-h-screen bg-zinc-600">Section 1</section>
      <section className="min-h-screen bg-zinc-700">Section 2</section>
      <section className="min-h-screen bg-zinc-800">Section 3</section> */}
    </div>
  );
};

export default Product;
