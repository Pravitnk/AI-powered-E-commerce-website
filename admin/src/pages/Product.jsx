import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AddProduct = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit formData to backend API
    console.log(formData);
  };

  return (
    <div className="p-4 w-full flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-orange-500 text-white">Add Product</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
                <Select
                  onValueChange={(val) => handleSelectChange("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(val) =>
                    handleSelectChange("subCategory", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shirts">Shirts</SelectItem>
                    <SelectItem value="Mobiles">Mobiles</SelectItem>
                    <SelectItem value="Sneakers">Sneakers</SelectItem>
                    <SelectItem value="Watches">Watches</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="sizes"
                  placeholder="Sizes (comma separated)"
                  value={formData.sizes}
                  onChange={handleChange}
                  required
                />
                <div className="col-span-2">
                  <Label htmlFor="images" className="mb-3">
                    Upload Images
                  </Label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            <Textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
              required
            />
            <div className="flex items-center space-x-2">
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
              <Button type="submit" className="bg-orange-500 text-white">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddProduct;
