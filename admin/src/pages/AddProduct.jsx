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

const AddProduct = ({ onProductAdd }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      id: Date.now(),
      imagePreviews: formData.images.map((file) => URL.createObjectURL(file)),
    };
    isFormValid();
    onProductAdd(newProduct);
    setOpen(false); // ✅ close dialog

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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Product</Button>
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
          <Input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            required
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
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              disabled={!isFormValid()}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
