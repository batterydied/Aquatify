import sequelize from '../database.js';
import { DataTypes } from 'sequelize';
import { ShopModel } from './ShopModel.js'; // Import the Shop model

const Shop = ShopModel.models.Shop;
// Define Models
const Product = sequelize.define("Product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
  },
  name: { type: DataTypes.STRING, allowNull: false },
  secondaryName: { type: DataTypes.STRING, allowNull: true },
  shopId: { type: DataTypes.UUID, allowNull: false, references: {
    model: Shop,
    key: 'id', // Foreign key reference to the Shop model's primary key
  }},
  categories: { 
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
    allowNull: false 
  },
  description: { type: DataTypes.STRING, allowNull: true },
}, {
  // Add virtual fields
  defaultScope: {
    attributes: { 
      include: [
        [
          sequelize.literal(`(
            SELECT AVG("rating") 
            FROM "Reviews" 
            WHERE "Reviews"."productId" = "Product"."productId"
          )`), 
          'rating'
        ],
        [
          sequelize.literal(`(
            SELECT "price" 
            FROM "ProductTypes" 
            WHERE "ProductTypes"."productId" = "Product"."productId"
            ORDER BY "id" ASC
            LIMIT 1
          )`), 
          'price'
        ]
      ]
    }
  }
});

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false},
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
  quantity: { type: DataTypes.INTEGER, allowNull: true },
});

// Define Relationships
Review.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(Review, { foreignKey: "productId", as: "reviews", onDelete: "CASCADE" });

Image.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(Image, { foreignKey: "productId", as: "images", onDelete: "CASCADE" });

ProductType.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(ProductType, { foreignKey: "productId", as: "productTypes", onDelete: "CASCADE" });

Product.belongsTo(Shop, { foreignKey: 'shopId', as: "shop" });
Shop.hasMany(Product, { foreignKey: 'shopId', onDelete: "CASCADE" });

// Export Models
class _ProductModel {
  constructor() {
    this.models = { Product, Review, Image, ProductType };
  }
}

const ProductModel = new _ProductModel();
export { ProductModel };
