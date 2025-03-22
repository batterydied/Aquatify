import { CartModel } from "../models/CartModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { ShopModel } from "../models/ShopModel.js";

const { Cart, Product } = CartModel.models;
const { ProductType, Image } = ProductModel.models;
const { Shop } = ShopModel.models;

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
              {
                model: Shop,
                as: "shop",
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
              {
                model: Shop,
                as: "shop",
              },
            ],
          },
        ],
      });
      return res.status(200).json(cartItems);
    } catch (error) {
      return res.status(404).json({ message: "Failed to fetch cart items for the user." });
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
        where: { productId, productTypeId, isSaved: false, userId },
      });
  
      if (existingItem) {
        // If item exists, update quantity
        let updatedQuantity = existingItem.quantity + quantity;
        if(updatedQuantity > productType.quantity){
          updatedQuantity = productType.quantity
        }
        existingItem.quantity = updatedQuantity;
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
        price: 5.99
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

  static async clearCartById(req, res) {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }
  
      // Remove all non-saved items from the cart for the given userId
      const deletedCount = await Cart.destroy({
        where: {
          userId,
          isSaved: false,
        },
      });
  
      return res.status(200).json({
        message: `Cleared ${deletedCount} item(s) from the cart.`,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
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

  static async getSavedItemsByUserId(req, res) {
    try {
      const { userId } = req.params; // Extract userId from request parameters
      const savedItems = await Cart.findAll({
        where: { userId, isSaved: true },
        include: {
          model: Product,
          include: [
            { model: ProductType, as: "productTypes"},
            { model: Image, as: "images" },
            { model: Shop, as: "shop" },
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
  
      // Find the cart item by its ID
      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      // Check if an identical item is already saved for later
      const existingSavedItem = await Cart.findOne({
        where: {
          productId: cartItem.productId,
          productTypeId: cartItem.productTypeId,
          isSaved: true, // Ensure it is a saved item
          userId: cartItem.userId, // Ensure it belongs to the same user
        },
      });
  
      if (existingSavedItem) {
        // Fetch product type to check the maximum available quantity
        const productType = await ProductType.findOne({
          where: {
            id: existingSavedItem.productTypeId,
            productId: existingSavedItem.productId,
          },
        });
  
        // Update the quantity of the existing saved item
        const maxStock = productType?.quantity || 0;
        existingSavedItem.quantity = Math.min(
          existingSavedItem.quantity + cartItem.quantity,
          maxStock
        );
        await existingSavedItem.save();
  
        // Remove the original cart item
        await cartItem.destroy();
  
        return res.status(200).json({
          message: "Item quantity updated in saved list.",
          item: existingSavedItem,
        });
      } else {
        // Update the item to be saved for later
        cartItem.isSaved = true;
        await cartItem.save();
  
        return res.status(200).json({
          message: "Item saved for later.",
          item: cartItem,
        });
      }
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
  
      // Find the cart item by its ID
      const cartItem = await Cart.findOne({
        where: {
          id,         // Find by ID
          isSaved: true // Ensure it is a saved item
        }
      });
      
      if(!cartItem){
        return res.status(404).json({ message: "Can not find saved item to move back to cart." });
      }
      // Check if a similar item exists in the active cart
      const existingItem = await Cart.findOne({
        where: {
          productTypeId: cartItem.productTypeId,
          userId: cartItem.userId,
          productId: cartItem.productId,
          isSaved: false, // Ensure the item is in the active cart
        },
      });
  
      if (existingItem) {
        // Fetch product type to check the maximum available quantity
        const productType = await ProductType.findOne({
          where: {
            id: existingItem.productTypeId,
            productId: existingItem.productId,
          },
        });
  
        // Calculate the updated quantity ensuring it doesn't exceed the stock
        const maxStock = productType?.quantity || 0;
        existingItem.quantity = Math.min(existingItem.quantity + cartItem.quantity, maxStock);
        await existingItem.save();
  
        // Remove the original saved item
        await cartItem.destroy();
  
        return res.status(200).json({
          message: "Item quantity updated in cart.",
          item: existingItem,
        });
      } else {
        // If no matching item exists, move the current item back to the cart
        cartItem.isSaved = false;
        await cartItem.save();
  
        return res.status(200).json({
          message: "Item moved back to cart.",
          item: cartItem,
        });
      }
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
  
      // Check if the cart item exists
      const cartItem = await Cart.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      // If quantity is less than or equal to 0, delete the cart item
      if (quantity <= 0) {
        await cartItem.destroy();
        return res.status(200).json({ message: "Cart item deleted due to invalid quantity." });
      }
  
      // Otherwise, update the cart item
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
