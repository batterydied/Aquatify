import UserModel from "../models/UserModel.js";

const { User, Address, PaymentMethod, OrderHistory } = UserModel.models;

class UserController {
  constructor() {
    this.model = UserModel; // Associate the controller with the UserModel abstraction
  }
  async getAllUsers(req, res) {
    try {
        const users = User.findAll({include : ["Address", "PaymentMethod", "OrderHistory"]});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({error: "Failed to retrieve users"});
    }
  }
  // Get a user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        include: [Address, PaymentMethod, OrderHistory],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  }

  // Create a new user
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await User.create({ name, email, password });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while creating the user." });
    }
  }

  // Update an existing user
  async updateUser(req, res) {
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
  async deleteUser(req, res) {
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

export default new UserController();
