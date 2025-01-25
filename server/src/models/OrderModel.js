import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import { ProductModel } from "./ProductModel.js";
import { UserModel } from "./UserModel.js";

// Destructure models from imported modules
const { Product, ProductType } = ProductModel.models;
const { User } = UserModel.models;

// Define the Order model
const Order = sequelize.define("Order", {
    orderId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
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
        type: DataTypes.STRING, 
        allowNull: true,      
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
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
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

// Define the OrderProduct join table
const OrderProduct = sequelize.define("OrderProduct", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  priceAtTimeOfOrder: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Order belongs to User (one-to-many)
Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "userId", as: "orders", onDelete: "CASCADE" });

// Many-to-many relationship between Order and Product through OrderProduct
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: "productId" });


// Export Models
class _OrderModel {
  constructor() {
    this.models = { Order, OrderProduct };
  }
}

const OrderModel = new _OrderModel();
export { OrderModel };