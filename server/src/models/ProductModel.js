import sequelize from '../database.js';
import { DataTypes } from 'sequelize';

const Product = sequelize.define("Product", {
  prodid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondaryname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sellerid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sellername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false },
});

const Image = sequelize.define("Image", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
});

const ProductType = sequelize.define("ProductType", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
});

// Define relationships
Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId", as: "Reviews" });

Image.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Image, { foreignKey: "productId", as: "Images" });

ProductType.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(ProductType, { foreignKey: "productId", as: "ProductTypes" });

class _ProductModel {
  constructor() {
    this.models = { Product, Review, Image, ProductType };
  }
}

const ProductModel = new _ProductModel();
export { ProductModel };