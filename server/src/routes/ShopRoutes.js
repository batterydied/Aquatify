import express from "express";
import ShopController from "../controllers/ShopController.js";

class ShopRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Fetch all shops
        this.router.get("/", ShopController.getAllShops);

        this.router.get("/:shopId/products", ShopController.getProductsByShopId);

        this.router.get("/user/:userId", ShopController.getShopByUserId);
        // Fetch a single shop by ID
        this.router.get("/:shopId", ShopController.getShopById);

        // Create a new shop for a user
        this.router.post("/", ShopController.createShop);

        // Update an existing shop
        this.router.put("/:shopId", ShopController.updateShop);

        // Delete a shop by ID
        this.router.delete("/:shopId", ShopController.deleteShop);

        this.router.delete("/", ShopController.deleteAllShops);
    }
}

export default new ShopRoutes().router; // Export the router instance