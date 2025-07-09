// controllers/cartController.js
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware

    const { productId, qty, size } = req.body;
    // 1. Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Validate size
    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: "Invalid size for this product" });
    }

    // 3. Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 4. Check if item with same product & size exists
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ product: productId, qty, size });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] }); // return empty if no cart exists yet
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error("Get cart items error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCartItemQty = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from authentication middleware
    const { itemId, qty } = req.body; // Item ID and new quantity from request body

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart by its ID
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // If quantity is zero or less, remove the item; otherwise, update its quantity
    if (qty <= 0) {
      item.remove();
    } else {
      item.qty = qty;
    }

    // Save the cart and populate product details
    await cart.save();
    await cart.populate("items.product");

    // Return the updated cart
    res.status(200).json(cart);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
