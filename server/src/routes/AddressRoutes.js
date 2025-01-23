import express from "express";
import AddressController from "../controllers/AddressController.js";

const router = express.Router();

// Create a new address
router.post("/", AddressController.createAddress);

// Fetch addresses for a specific user
router.get("/user/:userId", AddressController.getAddressesByUserId);

// Update an address
router.put("/:id", AddressController.updateAddress);

// Delete an address
router.delete("/:id", AddressController.deleteAddress);

export default router;