import { OrderModel } from "../models/OrderModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { Op } from "sequelize"; // Import Sequelize operators

const { Order, OrderProduct, Address } = OrderModel.models;
const { Product, ProductType } = ProductModel.models;

class OrderController {
  constructor() {
    this.model = OrderModel; // Associate the controller with the OrderModel abstraction
  }

  // Retrieve all orders for the signed-in user
  static async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            include: [
              {
                model: ProductType,
                as: "productTypes", // Use the alias defined in the association
                attributes: ["type"], // Include product type name
              },
            ],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder"], // Include OrderProduct fields
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["streetAddress", "city", "state", "zipCode"], // Include address fields
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
            include: [
              {
                model: ProductType,
                as: "productTypes", // Use the alias defined in the association
                attributes: ["type"], // Include product type name
              },
            ],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder"], // Include OrderProduct fields
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["streetAddress", "city", "state", "zipCode"], // Include address fields
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
      const { userId, products, addressId } = req.body;

      // Validate input
      if (!userId || !products || !Array.isArray(products) || !addressId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Calculate total price
      let totalPrice = 0;
      for (const product of products) {
        const productData = await Product.findByPk(product.productId, {
          include: [{ model: ProductType, where: { type: product.productType } }],
        });

        if (!productData) {
          return res.status(404).json({ error: `Product ${product.productId} not found` });
        }

        totalPrice += productData.ProductTypes[0].price * product.quantity;
      }

      // Create the order
      const newOrder = await Order.create({
        userId,
        totalPrice,
        status: "pending",
        addressId,
      });

      // Add products to the order
      for (const product of products) {
        const productData = await Product.findByPk(product.productId, {
          include: [{ model: ProductType, where: { type: product.productType } }],
        });

        await OrderProduct.create({
          orderId: newOrder.orderId,
          productId: product.productId,
          quantity: product.quantity,
          priceAtTimeOfOrder: productData.ProductTypes[0].price,
        });
      }

      // Respond with the created order
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Failed to add order" });
    }
  }

  // Update an existing order
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { status, addressId } = req.body;

      // Validate input
      if (!status && !addressId) {
        return res.status(400).json({ error: "No fields to update" });
      }

      // Fetch the order
      const orderToUpdate = await Order.findByPk(id);

      if (!orderToUpdate) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Update fields
      if (status) orderToUpdate.status = status;
      if (addressId) orderToUpdate.addressId = addressId;

      await orderToUpdate.save();

      // Respond with the updated order
      res.status(200).json(orderToUpdate);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
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
            include: [
              {
                model: ProductType,
                as: "productTypes", // Use the alias defined in the association
                attributes: ["type"], // Include product type name
              },
            ],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder"], // Include OrderProduct fields
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["streetAddress", "city", "state", "zipCode"], // Include address fields
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
            include: [
              {
                model: ProductType,
                as: "productTypes", // Use the alias defined in the association
                attributes: ["type"], // Include product type name
              },
            ],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder"], // Include OrderProduct fields
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["streetAddress", "city", "state", "zipCode"], // Include address fields
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders by status:", error);
      res.status(500).json({ error: "Failed to retrieve orders by status" });
    }
  }

  // Add items to an existing order
  static async addItemsToOrder(req, res) {
    try {
      const { id } = req.params;
      const { products } = req.body;

      // Validate input
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid products format" });
      }

      // Fetch the order
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Add products to the order
      for (const product of products) {
        const productData = await Product.findByPk(product.productId, {
          include: [{ model: ProductType, where: { type: product.productType } }],
        });

        if (!productData) {
          return res.status(404).json({ error: `Product ${product.productId} not found` });
        }

        await OrderProduct.create({
          orderId: order.orderId,
          productId: product.productId,
          quantity: product.quantity,
          priceAtTimeOfOrder: productData.ProductTypes[0].price,
        });
      }

      // Respond with success
      res.status(200).json({ status: "Items added to order successfully" });
    } catch (error) {
      console.error("Error adding items to order:", error);
      res.status(500).json({ error: "Failed to add items to order" });
    }
  }

  // Remove a specific item from an order
  static async removeItemFromOrder(req, res) {
    try {
      const { id, itemId } = req.params;

      // Fetch the order product
      const orderProduct = await OrderProduct.findOne({
        where: { orderId: id, productId: itemId },
      });

      if (!orderProduct) {
        return res.status(404).json({ error: "Item not found in order" });
      }

      // Delete the item
      await orderProduct.destroy();

      // Respond with success
      res.status(200).json({ status: "Item removed from order successfully" });
    } catch (error) {
      console.error("Error removing item from order:", error);
      res.status(500).json({ error: "Failed to remove item from order" });
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

  // Search orders by criteria (e.g., date range, product name, user ID)
  static async searchOrders(req, res) {
    try {
      const { query } = req.query;

      // Build the search criteria
      const where = {};
      if (query) {
        where[Op.or] = [
          { userId: { [Op.like]: `%${query}%` } },
          { status: { [Op.like]: `%${query}%` } },
        ];
      }

      const orders = await Order.findAll({
        where,
        include: [
          {
            model: Product,
            attributes: ["productId", "name"],
            include: [
              {
                model: ProductType,
                as: "productTypes", // Use the alias defined in the association
                attributes: ["type"], // Include product type name
              },
            ],
            through: {
              attributes: ["quantity", "priceAtTimeOfOrder"], // Include OrderProduct fields
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["streetAddress", "city", "state", "zipCode"], // Include address fields
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error searching orders:", error);
      res.status(500).json({ error: "Failed to search orders" });
    }
  }
}

export default OrderController;