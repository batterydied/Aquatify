import express from "express";
import OrderController from "../controllers/OrderController.js";

class OrderRoutes {
  /**
   * Constructor for OrderRoutes.
   * Initializes the Express Router and sets up routes.
   */
  constructor() {
    this.router = express.Router(); // Initialize the router
    this.initializeRoutes(); // Define all routes
  }

  /**
   * Define all order-related API routes.
   */
  initializeRoutes() {
    // Fetch all orders for the signed-in user
    this.router.get("/", OrderController.getOrders);

    // Add a new order
    this.router.post("/", OrderController.addOrder);

    // Cancel (delete) an existing order
    this.router.delete("/:id", OrderController.cancelOrder);
  }

  /**
   * Return the configured router instance.
   * @returns {Router} - Express Router instance with all order routes.
   */
  getRouter() {
    return this.router;
  }
}

// Export the OrderRoutes instance
export default new OrderRoutes().getRouter();