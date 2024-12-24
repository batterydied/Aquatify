import { UserModel } from "../models/UserModel.js";

const { User, Address, PaymentMethod, OrderHistory } = UserModel.models;

class UserController {
  constructor() {
    this.model = UserModel; // Associate the controller with the UserModel abstraction
  }
  static async getAllUsers(req, res) {
    try {
        const users = await User.findAll({include : ["Addresses", "PaymentMethods", "OrderHistories"]});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({error: "Failed to retrieve users"});
    }
  }
  // Get a user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { include: ["Addresses", "PaymentMethods", "OrderHistories"] }); // Include related

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Create a new user
  static async createUser(req, res) {
    try {
      const { name, email } = req.body;
      const newUser = await User.create({ name, email });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while creating the user." });
    }
  }

  // Update an existing user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.update({ name, email, password });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while updating the user." });
    }
  }

  // Delete a user by ID
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while deleting the user." });
    }
  }
}

export default UserController;
