import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaCamera } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateProduct } from "@/redux/reducer/productSlice";
import toast from "react-hot-toast";

const MAX_IMAGES = 4;
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const EditProduct = ({ open, setOpen, product, loading, error }) => {
  const dispatch = useDispatch();
  const fileInputs = useRef([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    bestSeller: false,
    images: Array(MAX_IMAGES).fill(null), // for file objects
  });

  const [previews, setPreviews] = useState(Array(MAX_IMAGES).fill(null)); // for previews (URL or existing URL)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        sizes: product.sizes || [], // ← now an array
        bestSeller: product.bestSeller || false,
        images: Array(MAX_IMAGES).fill(null),
      });

      setPreviews([
        product.image1 || null,
        product.image2 || null,
        product.image3 || null,
        product.image4 || null,
      ]);
    }
  }, [product]);
  const triggerFileInput = (index) => {
    fileInputs.current[index]?.click();
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedPreviews = [...previews];
    const updatedImages = [...formData.images];

    updatedPreviews[index] = URL.createObjectURL(file);
    updatedImages[index] = file;

    setPreviews(updatedPreviews);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  //sizes
  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    const { name, description, price, category, subCategory, sizes } = formData;
    return (
      name.trim() &&
      description.trim() &&
      price &&
      category &&
      subCategory &&
      sizes.length > 0
    );
  };
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("sizes", JSON.stringify(formData.sizes));
    data.append("bestSeller", formData.bestSeller);

    formData.images.forEach((file, idx) => {
      if (file) {
        data.append(`image${idx + 1}`, file);
      }
    });

    try {
      await dispatch(
        updateProduct({ id: product._id, updateData: data })
      ).unwrap();
      toast.success("Product updated");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <Select
            value={formData.category}
            onValueChange={(val) => handleSelectChange("category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={formData.subCategory}
            onValueChange={(val) => handleSelectChange("subCategory", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shirts">Shirts</SelectItem>
              <SelectItem value="Phones">Phones</SelectItem>
            </SelectContent>
          </Select>

          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                {size}
              </label>
            ))}
          </div>
          <Label>Update Images</Label>
          <div className="flex gap-4 flex-wrap">
            {previews.map((img, index) => (
              <div
                key={index}
                onClick={() => triggerFileInput(index)}
                className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer bg-gray-100 overflow-hidden"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`img-${index}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaCamera size={24} className="text-gray-500" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputs.current[index] = el)}
                  onChange={(e) => handleImageChange(e, index)}
                />
              </div>
            ))}
          </div>

          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <div className="flex items-center gap-2">
            <input
              id="bestSeller"
              name="bestSeller"
              type="checkbox"
              checked={formData.bestSeller}
              onChange={handleChange}
            />
            <label htmlFor="bestSeller">Best Seller</label>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!isValid()} onClick={handleSubmit}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
