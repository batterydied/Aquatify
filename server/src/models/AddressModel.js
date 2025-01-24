import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import { UserModel } from "./UserModel.js";

const { User } = UserModel.models;

// Define the Address model
const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User, // Reference the User model
      key: 'id',   // Reference the primary key of the User model
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetAddress2: {
    type: DataTypes.STRING, // Optional field
    allowNull: true,        // Allow null for optional fields
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true, // Ensure zipCode contains only numbers
      len: [5, 10],    // Ensure zipCode is between 5 and 10 characters
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations
Address.belongsTo(User, {
  foreignKey: "userId", // Foreign key in the Address table
  onDelete: "CASCADE",  // Delete the address if the associated user is deleted
});

User.hasMany(Address, {
  foreignKey: "userId", // Foreign key in the Address table
  as: "addresses",      // Alias for the association
  onDelete: "CASCADE",  // Delete all addresses if the user is deleted
});

// Export the Address model
class _AddressModel {
  constructor() {
    this.models = { Address };
  }
}

const AddressModel = new _AddressModel();
export { AddressModel };