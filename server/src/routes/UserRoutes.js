
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

    // Delete a User by ID
    this.router.delete("/:id", UserController.deleteUser);
    }
}

export default new UserRoutes().router; // Export the router instance