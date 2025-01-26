import { OrderModel } from "../models/OrderModel.js";
import { ProductModel } from "../models/ProductModel.js";
import sequelize from "../database.js";
const { Order, OrderProduct } = OrderModel.models;
const { Product, ProductType } = ProductModel.models;

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
    const transaction = await sequelize.transaction(); // Start a transaction
  
    try {
      const { userId, name, phoneNumber, streetAddress, streetAddress2, city, state, zipCode, totalPrice, products, tax, subtotal } = req.body;
  
      // Validate input
      if (!userId || !name || !phoneNumber || !streetAddress || !city || !state || !zipCode || !totalPrice || !products || !tax || !subtotal) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Validate products and check stock availability
      for (const product of products) {
        const productType = await ProductType.findOne({
          where: { id: product.productTypeId },
          transaction,
        });
  
        if (!productType) {
          await transaction.rollback();
          return res.status(400).json({ error: `Product type ${product.productTypeId} not found` });
        }
  
        if (productType.quantity < product.quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: `Insufficient stock for product type ${product.productTypeId}` });
        }
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
        tax,
        subtotal
      }, { transaction });
  
      // Associate products with the order and update stock levels
    const productPromises = products.map(async (product) => {
        // Fetch the product to get its name
        const productInstance = await Product.findOne({
            where: { productId: product.productId }
        });
    
        // Check if the product exists
        if (!productInstance) {
            throw new Error(`Product with ID ${product.productId} not found`);
        }
    
        const productName = productInstance.name; // Access the name property correctly
    
        // Fetch the product type
        const productType = await ProductType.findOne({
            where: { id: product.productTypeId },
            transaction,
        });
    
        // Check if the product type exists
        if (!productType) {
            throw new Error(`Product type with ID ${product.productTypeId} not found`);
        }
    
        // Update the stock level
        productType.quantity -= product.quantity;
        await productType.save({ transaction });
    
        // Create the order product
        return OrderProduct.create({
            productId: product.productId,
            productTypeId: product.productTypeId,
            productName, // Use the correctly fetched product name
            productType: productType.type,
            quantity: product.quantity,
            priceAtTimeOfOrder: product.priceAtTimeOfOrder,
            orderId: newOrder.orderId, // Link to the newly created order
        }, { transaction });
    });
    
    await Promise.all(productPromises);
  
      // Commit the transaction
      await transaction.commit();
  
      // Respond with the created order and associated data
      res.status(201).json(newOrder);
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
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