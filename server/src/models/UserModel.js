import sequelize from '../database.js';
import { DataTypes } from 'sequelize';

// Define User Model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  avatarFileURI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasShop: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});



// Define PaymentMethod Model
const PaymentMethod = sequelize.define("PaymentMethod", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isCreditCard: true,
    },
  },
  expiryMonth: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [2, 2],
    },
  },
  expiryYear: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [2, 2],
    },
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [3, 4],
    },
  },
  cardName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define OrderHistory Model
const OrderHistory = sequelize.define("OrderHistory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

PaymentMethod.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(PaymentMethod, { foreignKey: "userId", onDelete: "CASCADE", as: "PaymentMethods" });

OrderHistory.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(OrderHistory, { foreignKey: "userId", onDelete: "CASCADE", as: "OrderHistories" });

// Define the UserModel Class
class _UserModel {
  constructor() {
    this.models = { User, PaymentMethod, OrderHistory };
  }
}

// Initialize and export the UserModel
const UserModel = new _UserModel();
export { UserModel };
