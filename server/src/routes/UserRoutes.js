
import express from "express";
import UserController from "../controllers/UserController.js";

class UserRoutes {
    constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    }

    initializeRoutes() {
    // Fetch all Users
    this.router.get("/", (req, res) => UserController.getAllUsers(req, res));

    // Fetch a single User by ID
    this.router.get("/:id", (req, res) => UserController.getUser(req, res));

    // Add a new User
    this.router.post("/", (req, res) => UserController.addUser(req, res));

    // Update an existing User
    this.router.put("/:prodid", (req, res) => UserController.updateUser(req, res));

    // Delete a User by ID
    this.router.delete("/:prodid", (req, res) => UserController.deleteUser(req, res));
    }
}

export default new UserRoutes().router; // Export the router instance