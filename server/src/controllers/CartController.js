import { CartModel } from "../models/CartModel.js";
import { ProductModel } from "../models/ProductModel.js";

const { Cart, Product } = CartModel.models;
const { ProductType, Image } = ProductModel.models;

class CartController {
  /**
   * Get all cart items that are not saved for later.
   */
  static async getCartItems(req, res) {
    try {
      const cartItems = await Cart.findAll({
        where: { isSaved: false },
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductType,
                as: "productTypes",
              },
              {
                model: Image,
                as: "images",
              },
            ],
            logging: console.log,
          }
        ],
      });

      return res.status(200).json(cartItems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch cart items." });
    }
  }

  static async getAllCartItemsByUser(req, res) {
    try {
      const { userId } = req.params; // Extract userId from request parameters
  
      // Fetch cart items belonging to the specific user
      const cartItems = await Cart.findAll({
        where: { userId, isSaved: false }, // Filter by userId and unsaved cart items
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductType,
                as: "productTypes",
              },
              {
                model: Image,
                as: "images",
              },
            ],
          },
        ],
        logging: console.log, // Optional for debugging SQL queries
      });
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: "No cart items found for this user." });
      }
  
      return res.status(200).json(cartItems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch cart items for the user." });
    }
  }
  
  /**
   * Add a new item to the cart.
   */
  static async addCartItem(req, res) {
    try {
      const { productId, productTypeId, quantity = 1, userId } = req.body;
  
      // Check if the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      // Check if the specified product type exists and is associated with the product
      const productType = await ProductType.findOne({
        where: { id: productTypeId, productId },
      });
      if (!productType) {
        return res.status(404).json({ message: "Product type not found for the specified product." });
      }
  
      // Check if the item already exists in the cart
      const existingItem = await Cart.findOne({
        where: { productId, productTypeId, isSaved: false },
      });
  
      if (existingItem) {
        // If item exists, update quantity
        existingItem.quantity += quantity;
        await existingItem.save();
        return res.status(200).json({ message: "Cart item updated.", item: existingItem });
      }
  
      // Create a new cart item
      const newCartItem = await Cart.create({
        productId,
        userId,
        productTypeId,
        quantity,
        isSaved: false,
      });
  
      return res.status(201).json(newCartItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to add item to the cart." });
    }
  }

  /**
   * Remove a specific item from the cart.
   */
  static async removeCartItem(req, res) {
    try {
      const { id } = req.params;

      // Find the cart item by ID
      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }

      // Delete the item
      await cartItem.destroy();
      return res.status(200).json({ message: "Item removed from the cart." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to remove item from the cart." });
    }
  }

  /**
   * Clear all items in the cart.
   */
  static async clearCart(req, res) {
    try {
      // Remove all non-saved items from the cart
      await Cart.destroy({
        where: { isSaved: false },
      });
      return res.status(200).json({ message: "Cart cleared." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to clear the cart." });
    }
  }

  /**
   * Get all saved-for-later items in the cart.
   */
  static async getSavedItems(req, res) {
    try {
      const savedItems = await Cart.findAll({
        where: { isSaved: true },
        include: {
          model: Product,
          include: [
            { model: ProductType, as: "productTypes"},
            { model: Image, as: "images" }
          ]
        },
      });

      if (savedItems.length === 0) {
        return res.status(404).json({ message: "No saved items found." });
      }

      return res.status(200).json(savedItems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch saved items." });
    }
  }

  /**
   * Save a cart item for later.
   */
  static async saveForLater(req, res) {
    try {
      const { id } = req.params;

      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }

      // Update the item to be saved for later
      cartItem.isSaved = true;
      await cartItem.save();

      return res.status(200).json({ message: "Item saved for later.", item: cartItem });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to save item for later." });
    }
  }

  /**
   * Move a saved item back to the cart.
   */
  static async moveToCart(req, res) {
    try {
      const { id } = req.params;

      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }

      // Move item back to the cart
      cartItem.isSaved = false;
      await cartItem.save();

      return res.status(200).json({ message: "Item moved back to cart.", item: cartItem });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to move item back to cart." });
    }
  }

  /**
   * Update the quantity of a specific cart item.
   */
  static async updateCartItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero." });
      }

      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      return res.status(200).json({ message: "Cart item updated.", item: cartItem });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update cart item." });
    }
  }
}

export default CartController;
