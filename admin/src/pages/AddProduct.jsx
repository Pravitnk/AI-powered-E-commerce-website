import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/redux/reducer/productSlice";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";

const MAX_IMAGES = 4;
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProduct = ({ onProductAdd }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestSeller: false,
  });

  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(MAX_IMAGES).fill(null));
  const fileInputs = useRef([]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = URL.createObjectURL(file);
    setImages(updatedImages);

    const updatedFiles = [...imageFiles];
    updatedFiles[index] = file;
    setImageFiles(updatedFiles);
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

  const triggerFileInput = (index) => {
    if (fileInputs.current[index]) {
      fileInputs.current[index].click();
    }
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

  const isFormValid = () => {
    const { name, description, price, category, subCategory, sizes } = formData;
    return (
      name.trim() &&
      description.trim() &&
      price &&
      category &&
      subCategory &&
      sizes.length > 0 && // Now checking length of array
      imageFiles.filter(Boolean).length === MAX_IMAGES
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("sizes", JSON.stringify(formData.sizes));
    data.append("bestSeller", formData.bestSeller);

    imageFiles.forEach((file, idx) => {
      data.append(`image${idx + 1}`, file);
    });

    try {
      await dispatch(addProduct(data)).unwrap();
      toast.success("Product added successfully");
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: "",
        bestSeller: false,
      });
      setImages(Array(MAX_IMAGES).fill(null));
      setImageFiles(Array(MAX_IMAGES).fill(null));
    } catch (error) {
      toast.error(`Failed to add product: ${error}`);
      console.error("Failed to add product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="btn-primary">
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <Select onValueChange={(val) => handleSelectChange("category", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
          <Select
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
          <Label>Upload Images</Label>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => triggerFileInput(index)}
                className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer bg-gray-100 overflow-hidden"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`preview-${index}`}
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
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
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
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid() || loading}>
              {loading ? "Adding..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
