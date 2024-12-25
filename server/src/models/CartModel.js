import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { ProductModel } from "./ProductModel.js";

const Product = ProductModel.models.Product;

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productTypeId: { type: DataTypes.INTEGER, allowNull: false},
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Product.hasMany(Cart, { foreignKey: "productId" }); // A product can appear in many cart entries.
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" }); // A cart item is associated with one product.

// CartModel Class
class _CartModel {
    constructor() {
        this.models = { Cart, Product };
    }
}

const CartModel = new _CartModel();
export { CartModel };
