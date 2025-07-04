import React, { useState } from "react";
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

const AddProduct = ({ onProductAdd }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [open, setOpen] = useState(false); // 🔁 manually control dialog
  const [formData, setFormData] = useState({
    name: "",
    images: [],
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    bestSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { name, images, description, price, category, subCategory, sizes } =
      formData;
    return (
      name.trim() &&
      images.length === 4 &&
      description.trim() &&
      price &&
      category &&
      subCategory &&
      sizes.trim()
    );
  };
  // if (files.length !== 4) {
  //   toast.error("Please select exactly 4 images.");
  //   return;
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("sizes", JSON.stringify(formData.sizes.split(",")));
    data.append("bestSeller", formData.bestSeller);

    // Append each image with unique field name (like backend expects: image1, image2, ...)
    formData.images.forEach((file, idx) => {
      data.append(`image${idx + 1}`, file);
    });

    try {
      await dispatch(addProduct(data)).unwrap(); // waits for promise to resolve or throw
      toast.success("Product added successfully");

      setOpen(false); // Close dialog
      setFormData({
        name: "",
        images: [],
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: "",
        bestSeller: false,
      });
    } catch (error) {
      toast.error(`Failed to add product: ${error}`);
      console.error("Failed to add product:", error);
      // Optional: show toast or error UI
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
          <Input
            name="sizes"
            placeholder="Sizes (comma separated)"
            value={formData.sizes}
            onChange={handleChange}
            required
          />
          <Label>Upload Images</Label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            required
            maxLength={4}
          />
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
