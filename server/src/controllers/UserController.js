import { UserModel } from "../models/UserModel.js";

const { User, PaymentMethod, OrderHistory } = UserModel.models;

class UserController {
  constructor() {
    this.model = UserModel; // Associate the controller with the UserModel abstraction
  }
  static async getAllUsers(req, res) {
    try {
        const users = await User.findAll({include : ["PaymentMethods", "OrderHistories"]});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({error: "Failed to retrieve users."});
    }
  }
  // Get a user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { include: ["PaymentMethods", "OrderHistories"] }); // Include related

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user." });
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({
        where: { email },
        include: ["PaymentMethods", "OrderHistories"], // Include related models
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      res.status(500).json({ error: "Failed to retrieve user." });
    }
  }
  
  // Create a new user
  static async createUser(req, res) {
    try {
      const { name, email } = req.body;
  
      // If name is not provided, use the email prefix (before @)
      const userName = name || email.split('@')[0];
      const first20Chars = userName.slice(0, 20);
  
      // Create the user
      const newUser = await User.create({ name: first20Chars, email });
      return res.status(201).json(newUser);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(500).json({ error: "This user already exists." });
      }
      return res.status(500).json({ error: "An error occurred while creating the user." });
    }
  }  

  // Update an existing user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, avatarFileURI} = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const updatedFields = {};

      if (name !== undefined) updatedFields.name = name;
      if (email !== undefined) updatedFields.email = email;
      if (avatarFileURI !== undefined) updatedFields.avatarFileURI = avatarFileURI;

      if (Object.keys(updatedFields).length > 0) {
        await user.update(updatedFields);
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while updating the user." });
    }
  }

  static async deleteAllUsers(req, res){
    try{
      const users = await User.findAll();
      if(users.length === 0){
        return res.status(404).json({ message: "No users found." });
      }
      for (const user of users) {
        await user.destroy();
      }
      return res.status(200).json({ message: "All users deleted successfully." });
    } catch (error) {
      console.error("Error deleting all users:", error);
      res.status(500).json({ error: "Failed to delete all users." });
    }
  }
  // Delete a user by ID
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while deleting the user." });
    }
  }

  static async getUserOrCreate(req, res) {
    const { email } = req.params;
    try {
      // Try fetching the user
      const response = await fetch(`http://localhost:3000/api/user/email/${email}`);
      if (!response.ok) {
        throw new Error(`User not found, status: ${response.status}`);
      }
  
      const user = await response.json(); // Parse the response JSON
  
      // Respond with the existing user data
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
  
      try {
        // Make a POST request to create a new user

        const postResponse = await fetch(`http://localhost:3000/api/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), // Send the email in the request body
        });
  
        if (!postResponse.ok) {
          throw new Error(`Failed to create user, status: ${postResponse.status}`);
        }
  
        const newUser = await postResponse.json(); // Parse the new user data
  
        // Respond with the newly created user data
        return res.status(201).json(newUser);
      } catch (postError) {
        console.error("Error creating user:", postError);
  
        // Respond with an error if both fetch and post fail
        return res.status(500).json({ error: "Failed to fetch or create user" });
      }
    }
  }

  static async deleteAvatarURI(req, res){
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      await user.update({avatarFileURI: null});
      return res.status(200).json({ message: "User avatar deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while deleting the user avatar." });
    }
  }

  static async getUserPaymentMethods(req, res) {
    try {
      const { id } = req.params;

      // Find the user by ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Fetch all payment methods associated with the user
      const paymentMethods = await PaymentMethod.findAll({
        where: { userId: id }, // Assuming the PaymentMethod model has a `userId` field
      });

      // Return the payment methods
      res.status(200).json(paymentMethods);
    } catch (error) {
      console.error("Error retrieving user payment methods:", error);
      res.status(500).json({ error: "Failed to retrieve payment methods." });
    }
  }

  static async addPaymentMethod(req, res) {
    try {
      const { id } = req.params; // User ID
      const { cardNumber, expiryMonth, expiryYear, cvv, cardName } = req.body;
  
      // Validate required fields
      if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardName) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Create a new payment method
      const newPaymentMethod = await PaymentMethod.create({
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardName,
        userId: id, // Associate the payment method with the user
      });
  
      // Return the newly created payment method
      res.status(201).json(newPaymentMethod);
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ error: "Failed to add payment method." });
    }
  }

  static async updatePaymentMethod(req, res) {
    try {
      const { id, paymentMethodId } = req.params; // User ID and Payment Method ID
      const { cardNumber, expiryMonth, expiryYear, cvv, cardName } = req.body;

      // Find the payment method
      const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId: id }, // Ensure the payment method belongs to the user
      });

      if (!paymentMethod) {
        return res.status(404).json({ error: "Payment method not found." });
      }

      // Update the payment method
      if (cardNumber !== undefined) paymentMethod.cardNumber = cardNumber;
      if (expiryMonth !== undefined) paymentMethod.expiryMonth = expiryMonth;
      if (expiryYear !== undefined) paymentMethod.expiryYear = expiryYear;
      if (cvv !== undefined) paymentMethod.cvv = cvv;
      if (cardName !== undefined) paymentMethod.cardName = cardName;

      await paymentMethod.save();

      // Return the updated payment method
      res.status(200).json(paymentMethod);
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Failed to update payment method." });
    }
  }
  static async deletePaymentMethod(req, res) {
    try {
      const { id, paymentMethodId } = req.params; // User ID and Payment Method ID

      // Find the payment method
      const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId: id }, // Ensure the payment method belongs to the user
      });

      if (!paymentMethod) {
        return res.status(404).json({ error: "Payment method not found." });
      }

      // Delete the payment method
      await paymentMethod.destroy();

      // Return a success message
      res.status(200).json({ message: "Payment method deleted successfully." });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      res.status(500).json({ error: "Failed to delete payment method." });
    }
  }
}

export default UserController;
