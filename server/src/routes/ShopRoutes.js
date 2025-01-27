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

        // Fetch a single shop by ID
        this.router.get("/:id", ShopController.getShopById);

        // Fetch all shops owned by a specific user
        this.router.get("/user/:userId", ShopController.getShopsByUser);

        // Create a new shop for a user
        this.router.post("/", ShopController.createShop);

        // Update an existing shop
        this.router.put("/:id", ShopController.updateShop);

        // Delete a shop by ID
        this.router.delete("/:id", ShopController.deleteShop);

        // Delete all shops owned by a specific user
        this.router.delete("/user/:userId", ShopController.deleteShopsByUser);
    }
}

export default new ShopRoutes().router; // Export the router instance