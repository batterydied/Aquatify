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
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
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
});

// Define the Address model
const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
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
      isNumeric: true,
      len: [5, 10],
    },
  },
});

// Define Relationships

// Order belongs to User (one-to-many)
Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "userId", as: "orders", onDelete: "CASCADE" });

// Many-to-many relationship between Order and Product through OrderProduct
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: "productId" });

// OrderProduct belongs to ProductType (one-to-many)
OrderProduct.belongsTo(ProductType, { foreignKey: "productTypeId", onDelete: "CASCADE" });
ProductType.hasMany(OrderProduct, { foreignKey: "productTypeId", onDelete: "CASCADE" });

Order.belongsTo(Address, {
    foreignKey: "addressId", // Foreign key in the Order table
    as: "address", // Alias for the association
    onDelete: "CASCADE", // Optional: Delete orders if the associated address is deleted
  });
Address.hasMany(Order, {
    foreignKey: "addressId", // Foreign key in the Order table
    as: "orders", // Alias for the association
    onDelete: "CASCADE", // Optional: Delete orders if the associated address is deleted
  });

// Export Models
class _OrderModel {
  constructor() {
    this.models = { Order, OrderProduct, Address };
  }
}

const OrderModel = new _OrderModel();
export { OrderModel };