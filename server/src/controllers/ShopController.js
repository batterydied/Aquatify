import { ShopModel } from "../models/ShopModel.js";
import { ProductModel } from "../models/ProductModel.js"

const { Shop } = ShopModel.models;
const { Product } = ProductModel.models;

class ShopController {
  // Get all shops
  static async getAllShops(req, res) {
    try {
      const shops = await Shop.findAll();
      res.status(200).json(shops);
    } catch (error) {
      console.error("Error retrieving shops:", error);
      res.status(500).json({ error: "Failed to retrieve shops." });
    }
  }

  // Get a single shop by ID
  static async getShopById(req, res) {
    try {
      const { id } = req.params;
      const shop = await Shop.findByPk(id);

      if (!shop) {
        return res.status(404).json({ error: "Shop not found." });
      }

      res.status(200).json(shop);
    } catch (error) {
      console.error("Error retrieving shop:", error);
      res.status(500).json({ error: "Failed to retrieve shop." });
    }
  }

  // Create a new shop for a user
  static async createShop(req, res) {
    try {
      const { shopName, userId, description, avatarFileURI } = req.body;

      if (!shopName || !userId) {
        return res.status(400).json({ error: "Shop name and user ID are required." });
      }

      const newShop = await Shop.create({ shopName, userId, description, avatarFileURI });
      res.status(201).json(newShop);
    } catch (error) {
      console.error("Error creating shop:", error);
      res.status(500).json({ error: "Failed to create shop." });
    }
  }

  // Update an existing shop
  static async updateShop(req, res) {
    try {
      const { id } = req.params;
      const { shopName, description, avatarFileURI } = req.body;

      const shop = await Shop.findByPk(id);
      if (!shop) {
        return res.status(404).json({ error: "Shop not found." });
      }

      const updatedFields = {};
      if (shopName !== undefined) updatedFields.shopName = shopName;
      if (description !== undefined) updatedFields.description = description;
      if (avatarFileURI !== undefined) updatedFields.avatarFileURI = avatarFileURI;

      if (Object.keys(updatedFields).length > 0) {
        await shop.update(updatedFields);
      }

      res.status(200).json(shop);
    } catch (error) {
      console.error("Error updating shop:", error);
      res.status(500).json({ error: "Failed to update shop." });
    }
  }

  // Delete a shop by ID
  static async deleteShop(req, res) {
    try {
      const { id } = req.params;

      const shop = await Shop.findByPk(id);
      if (!shop) {
        return res.status(404).json({ error: "Shop not found." });
      }

      await shop.destroy();
      res.status(200).json({ message: "Shop deleted successfully." });
    } catch (error) {
      console.error("Error deleting shop:", error);
      res.status(500).json({ error: "Failed to delete shop." });
    }
  }

  static async getProductsByShopId(req, res){
    try {
      const { id } = req.params;
      const products = await Product.findAll({
        where: {shopId: id}
      })
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by shop ID:", error);
      res.status(500).json({ error: "Failed to get products by shop ID." });
    }
  }
}

export default ShopController;