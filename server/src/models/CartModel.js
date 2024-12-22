import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { ProductModel } from "./ProductModel.js";

const Product = ProductModel.models.Product;

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Cart.belongsTo(Product, { foreignKey: "productId", as: "Products" });
Product.hasMany(Cart, { foreignKey: "productId" });

// CartModel Class
class _CartModel {
    constructor() {
        this.models = { Cart, Product };
    }
}

const CartModel = new _CartModel();
export { CartModel };
