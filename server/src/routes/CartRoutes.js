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
    this.router.get("/", (req, res) => {
      console.log("GET /api/cart called.");
      CartController.getCartItems(req, res); // Fetch user's cart items
    });

    // Add a route to clear all cart items
    this.router.delete("/", (req, res) => {
      console.log("DELETE /api/cart called.");
      CartController.clearCart(req, res); // Calls the controller method to clear the cart
    });

    // Add a new item to the cart
    this.router.post("/", (req, res) => {
      console.log("POST /api/cart called.");
      CartController.addCartItem(req, res); // Add a new item to the cart
    });

    // Remove a specific item from the cart
    this.router.delete("/:id", (req, res) => {
      console.log(`DELETE /api/cart/${req.params.id} called.`);
      CartController.removeCartItem(req, res); // Remove item by ID
    });

    // Fetch all saved-for-later items
    this.router.get("/saved", (req, res) => {
      console.log("GET /api/cart/saved called.");
      CartController.getSavedItems(req, res); // Fetch user's saved items
    });

    // Save a specific cart item for later
    this.router.post("/save/:id", (req, res) => {
      console.log(`POST /api/cart/save/${req.params.id} called.`);
      CartController.saveForLater(req, res); // Mark item as saved for later
    });

    // Move a saved item back to the cart
    this.router.post("/move/:id", (req, res) => {
      console.log(`POST /api/cart/move/${req.params.id} called.`);
      CartController.moveToCart(req, res); // Move item back to the cart
    });

    // Update the quantity of a specific cart item
    this.router.put("/:id", (req, res) => {
      console.log(`PUT /api/cart/${req.params.id} called.`);
      CartController.updateCartItem(req, res); // Update item quantity
    });
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
