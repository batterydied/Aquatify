import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import { UserModel } from './UserModel.js'; // Import the User model

// Define Shop Model
const Shop = sequelize.define("Shop", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shopName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 20], // Restrict to 1-20 characters
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // References the User table
      key: 'id',
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200], // Restrict to 0-200 characters
    },
  },
  avatarFileURI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define the relationship between Shop and User
const User = UserModel.models.User; // Access the User model from UserModel
Shop.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Shop, { foreignKey: "userId", onDelete: "CASCADE", as: "Shop" });

// Define the ShopModel Class
class _ShopModel {
  constructor() {
    this.models = { Shop };
  }
}

// Initialize and export the ShopModel
const ShopModel = new _ShopModel();
export { ShopModel };