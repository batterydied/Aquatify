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
    this.router.get("/", (req, res) => {
      console.log("GET /api/order called.");
      OrderController.getOrders(req, res); // Fetch user's orders
    });

    // Add a new order
    this.router.post("/", (req, res) => {
      console.log("POST /api/order called.");
      OrderController.addOrder(req, res); // Add a new order
    });

    // Cancel (delete) an existing order
    this.router.delete("/:id", (req, res) => {
      console.log(`DELETE /api/order/${req.params.id} called.`);
      OrderController.cancelOrder(req, res); // Cancel the specified order
    });
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