
import express from "express";
import UserController from "../controllers/UserController.js";

class UserRoutes {
    constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    }

    initializeRoutes() {
    // Fetch all Users
    this.router.get("/", UserController.getAllUsers);

    // Fetch a single User by ID
    this.router.get("/email/:email", UserController.getUserByEmail);

    // Get all payment methods for a user
    this.router.get("/payments/:id", UserController.getUserPaymentMethods);

    // Add a new payment method for a user
    this.router.post("/payments/:id", UserController.addPaymentMethod);

    // Update an existing payment method
    this.router.put("/payments/:id/:paymentMethodId", UserController.updatePaymentMethod);

    // Delete a payment method
    this.router.delete("/payments/:id/:paymentMethodId", UserController.deletePaymentMethod);

    // Fetch a User by email or create a new User
    this.router.get("/fetch/:email", UserController.getUserOrCreate);
    
    // Fetch a User by ID
    this.router.get("/:id", UserController.getUserById);

    // Add a new User
    this.router.post("/", UserController.createUser);

    // Update an existing User
    this.router.put("/:id", UserController.updateUser);

    // Delete all Users
    this.router.delete("/", UserController.deleteAllUsers);

    // Delete an User's avatar
    this.router.delete("/avatar/:id", UserController.deleteAvatarURI)

    // Delete a User by ID
    this.router.delete("/:id", UserController.deleteUser);
    }
}

export default new UserRoutes().router; // Export the router instance