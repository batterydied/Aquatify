import { OrderModel } from "../models/OrderModel.js";

const { Order, OrderProduct } = OrderModel.models;

class OrderController {
  constructor() {
    this.model = OrderModel; // Associate the controller with the OrderModel abstraction
  }

  // Fetch all orders for the signed-in user
  static async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: ["orderProducts"],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  // Fetch details of a specific order by its ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, { include: ["orderProducts"] });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  // Add a new order
  static async addOrder(req, res) {
    try {
      const { userId, name, phoneNumber, streetAddress, streetAddress2, city, state, zipCode, totalPrice, products } = req.body;

      // Validate input
      if (!userId || !name || !phoneNumber || !streetAddress || !city || !state || !zipCode || !totalPrice || !products) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create a new order
      const newOrder = await Order.create({
        userId,
        name,
        phoneNumber,
        streetAddress,
        streetAddress2,
        city,
        state,
        zipCode,
        totalPrice,
      });

      // Check if products are provided and associate them with the order
      if (products && Array.isArray(products)) {
        const productPromises = products.map(product =>
          OrderProduct.create({
            productId: product.productId,
            productName: product.productName,
            productType: product.productType,
            quantity: product.quantity,
            priceAtTimeOfOrder: product.priceAtTimeOfOrder,
            orderId: newOrder.orderId, // Link to the newly created order
          })
        );
        await Promise.all(productPromises);
      }

      // Respond with the created order and associated data
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Failed to add order" });
    }
  }

  // Cancel (delete) an existing order
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;

      // Step 1: Check if the order exists
      const orderToDelete = await Order.findOne({ where: { orderId: id } });

      if (!orderToDelete) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Step 2: Delete related products
      await OrderProduct.destroy({ where: { orderId: id } });

      // Step 3: Delete the order itself
      await orderToDelete.destroy();

      // Step 4: Respond with success
      res.status(200).json({ status: "Order canceled successfully" });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  }
  static async deleteAllOrders(req, res) {
    try {
      // Step 1: Delete all records from the OrderProduct table
      await OrderProduct.destroy({ where: {} });

      // Step 2: Delete all records from the Order table
      await Order.destroy({ where: {} });

      // Step 3: Respond with success
      res.status(200).json({ status: "All orders deleted successfully" });
    } catch (error) {
      console.error("Error deleting all orders:", error);
      res.status(500).json({ error: "Failed to delete all orders" });
    }
  }
  // Fetch all orders for a specific user (admin only)
  static async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const orders = await Order.findAll({
        where: { userId },
        include: ["orderProducts"],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
      res.status(500).json({ error: "Failed to fetch orders by user ID" });
    }
  }

  // Fetch all orders with a specific status
  static async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const orders = await Order.findAll({
        where: { status },
        include: ["orderProducts"],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      res.status(500).json({ error: "Failed to fetch orders by status" });
    }
  }

  // Update the status of an order
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate input
      if (!status || !["pending", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status provided" });
      }

      // Step 1: Fetch the order by its ID
      const orderToUpdate = await Order.findOne({ where: { orderId: id } });

      if (!orderToUpdate) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Step 2: Update the order status
      await orderToUpdate.update({ status });

      // Step 3: Respond with the updated order
      res.status(200).json({
        status: "Order status updated successfully",
        updatedOrder: orderToUpdate,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
}

export default OrderController;