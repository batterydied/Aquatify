import { AddressModel } from "../models/AddressModel.js";

const { Address } = AddressModel.models;

class AddressController {
  // Create a new address
  static async createAddress(req, res) {
    try {
      const { userId, streetAddress, city, state, zipCode, streetAddress2, name, phoneNumber } = req.body;

      // Validate input
      if (!userId || !streetAddress || !city || !state || !zipCode || !name || !phoneNumber) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create the address
      const newAddress = await Address.create({
        userId,
        name, 
        phoneNumber,
        streetAddress,
        streetAddress2,
        city,
        state,
        zipCode,
      });

      // Respond with the created address
      res.status(201).json(newAddress);
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ error: "Failed to create address" });
    }
  }

  // Fetch addresses for a specific user
  static async getAddressesByUserId(req, res) {
    try {
      const { userId } = req.params;

      const addresses = await Address.findAll({
        where: { userId },
      });

      res.status(200).json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  }

  // Update an address
  static async updateAddress(req, res) {
    try {
      const { id } = req.params;
      const { streetAddress, city, state, zipCode, streetAddress2, phoneNumber, name } = req.body;

      // Validate input
      if (!streetAddress && !city && !state && !zipCode && !streetAddress2 && !phoneNumber && !name) {
        return res.status(400).json({ error: "No fields to update" });
      }

      // Fetch the address
      const addressToUpdate = await Address.findByPk(id);

      if (!addressToUpdate) {
        return res.status(404).json({ error: "Address not found" });
      }

      // Update fields
      if (streetAddress) addressToUpdate.streetAddress = streetAddress;
      if (streetAddress2) addressToUpdate.streetAddress2 = streetAddress2;
      if (name) addressToUpdate.name = name;
      if (phoneNumber) addressToUpdate.phoneNumber = phoneNumber;
      if (city) addressToUpdate.city = city;
      if (state) addressToUpdate.state = state;
      if (zipCode) addressToUpdate.zipCode = zipCode;

      await addressToUpdate.save();

      // Respond with the updated address
      res.status(200).json(addressToUpdate);
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ error: "Failed to update address" });
    }
  }

  // Delete an address
  static async deleteAddress(req, res) {
    try {
      const { id } = req.params;

      // Fetch the address
      const addressToDelete = await Address.findByPk(id);

      if (!addressToDelete) {
        return res.status(404).json({ error: "Address not found" });
      }

      // Delete the address
      await addressToDelete.destroy();

      // Respond with success
      res.status(200).json({ status: "Address deleted successfully" });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ error: "Failed to delete address" });
    }
  }
}

export default AddressController;