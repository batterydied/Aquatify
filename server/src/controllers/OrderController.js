import { OrderModel } from "../models/OrderModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { UserModel } from "../models/UserModel.js";
import { Op } from "sequelize";
import sequelize from "../database.js";

const { Order, OrderProduct } = OrderModel.models;
const { Product, ProductType } = ProductModel.models;
const { User } = UserModel.models;

class OrderController {
  // Retrieve all orders
  static async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder", "productType"],
            },
          },
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }

  // Retrieve a specific order by ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            through: {
                attributes: ["quantity", "priceAtTimeOfOrder", "productType"],
            },
          },
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error retrieving order:", error);
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  }

  // Add a new order
  static async addOrder(req, res) {
    try {
      const { userId, products, name, phoneNumber, streetAddress, streetAddress2, city, state, zipCode } = req.body;

      // Validate input
      if (!userId || !products || !Array.isArray(products) || !name || !phoneNumber || !streetAddress || !city || !state || !zipCode) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Calculate total price
      let totalPrice = 0;
      for (const product of products) {
        const productData = await Product.findByPk(product.productId, {
          include: [
            {
              model: ProductType,
              as: "productTypes",
              where: { id: product.productTypeId },
            },
          ],
        });

        if (!productData || !productData.productTypes || productData.productTypes.length === 0) {
          return res.status(404).json({ error: `Product or product type not found for product ${product.productId}` });
        }

        totalPrice += productData.productTypes[0].price * product.quantity;
      }

      // Create the order
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
        status: "pending",
      });

      // Add products to the order
      for (const product of products) {
        const productData = await Product.findByPk(product.productId, {
          include: [
            {
              model: ProductType,
              as: "productTypes",
              where: { id: product.productTypeId },
            },
          ],
        });

        await OrderProduct.create({
          productId: productData.productId,
          orderId: newOrder.orderId,
          quantity: product.quantity,
          priceAtTimeOfOrder: productData.productTypes[0].price,
          productType: productData.productTypes[0].type,
        });
      }

      // Respond with the created order
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

      // Fetch the order
      const orderToDelete = await Order.findByPk(id);

      if (!orderToDelete) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Delete the order
      await orderToDelete.destroy();

      // Respond with success
      res.status(200).json({ status: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }

  // Fetch all orders for a specific user
  static async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;

      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder", "productType"],
            },
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders by user:", error);
      res.status(500).json({ error: "Failed to retrieve orders by user" });
    }
  }

  // Fetch all orders with a specific status
  static async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;

      const orders = await Order.findAll({
        where: { status },
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder", "productType"],
            },
            include: [
              {
                model: ProductType,
                as: "productTypes",
                attributes: ["id", "type"],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders by status:", error);
      res.status(500).json({ error: "Failed to retrieve orders by status" });
    }
  }

  // Update the status of an order
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate input
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      // Fetch the order
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Update the status
      order.status = status;
      await order.save();

      // Respond with success
      res.status(200).json({ status: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
}

export default OrderController;