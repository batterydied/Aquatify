
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
    this.router.get("/:userid", UserController.getUserById);

    // Add a new User
    this.router.post("/", UserController.createUser);

    // Update an existing User
    this.router.put("/:userid", UserController.updateUser);

    // Delete a User by ID
    this.router.delete("/:userid", UserController.deleteUser);
    }
}

export default new UserRoutes().router; // Export the router instance