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

    // Fetch details of a specific order by its ID
    this.router.get("/:id", OrderController.getOrderById);

    // Add a new order
    this.router.post("/", OrderController.addOrder);

    // Update an existing order
    this.router.put("/:id", OrderController.updateOrder);

    // Cancel (delete) an existing order
    this.router.delete("/:id", OrderController.cancelOrder);

    // Fetch all orders for a specific user (admin only)
    this.router.get("/user/:userId", OrderController.getOrdersByUserId);

    // Fetch all orders with a specific status
    this.router.get("/status/:status", OrderController.getOrdersByStatus);

    // Add items to an existing order
    this.router.post("/:id/items", OrderController.addItemsToOrder);

    // Remove a specific item from an order
    this.router.delete("/:id/items/:itemId", OrderController.removeItemFromOrder);

    // Update the status of an order
    this.router.put("/:id/status", OrderController.updateOrderStatus);

    // Search orders by criteria
    this.router.get("/search", OrderController.searchOrders);

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