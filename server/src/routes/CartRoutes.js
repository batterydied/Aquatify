import express from "express";
import CartController from "../controllers/CartController.js";

class CartRoutes {
  /**
   * Constructor for CartRoutes.
   * Initializes the Express Router and sets up routes.
   */
  constructor() {
    this.router = express.Router(); // Initialize the router
    this.initializeRoutes(); // Define all routes
  }

  /**
   * Define all cart-related API routes.
   */
  initializeRoutes() {
    // Fetch all cart items (not saved)
    this.router.get("/", CartController.getCartItems);

    this.router.get("/user/:userId", CartController.getAllCartItemsByUser);

    // Add a route to clear all cart items
    this.router.delete("/", CartController.clearCart);

    // Add a new item to the cart
    this.router.post("/", CartController.addCartItem);

    this.router.delete("/user/:userId", CartController.clearCartById);

    // Remove a specific item from the cart
    this.router.delete("/:id", CartController.removeCartItem);

    // Fetch all saved-for-later items
    this.router.get("/saved", CartController.getSavedItems);

    this.router.get("/saved/user/:userId", CartController.getSavedItemsByUserId);

    // Save a specific cart item for later
    this.router.post("/save/:id", CartController.saveForLater);

    // Move a saved item back to the cart
    this.router.post("/move/:id", CartController.moveToCart);

    // Update the quantity of a specific cart item
    this.router.put("/:id", CartController.updateCartItem);
  }

  /**
   * Return the configured router instance.
   * @returns {Router} - Express Router instance with all cart routes.
   */
  getRouter() {
    return this.router;
  }
}

// Export the CartRoutes instance
export default new CartRoutes().getRouter();
