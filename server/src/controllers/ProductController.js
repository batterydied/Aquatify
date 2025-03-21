import { ProductModel } from "../models/ProductModel.js";
import { ShopModel } from "../models/ShopModel.js";
import sequelize from "../database.js";

const { Product, Image, Review, ProductType } = ProductModel.models;
const { Shop } = ShopModel.models;

class ProductController {
  constructor() {
    this.model = ProductModel; // Associate the controller with the ProductModel abstraction
  }

  // Retrieve all products from the database, including related images
  static async getAllProducts(req, res) {
    try {
        const products = await Product.findAll({ include: ["images", "reviews", "productTypes", {
          model: Shop,
          as: "shop",
          attributes: ['shopName', 'userId'] // Only include shopName
        }]});// Include related
        res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
  }

  // Retrieve a specific product by ID, including related images
  static async getProductById(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findByPk(productId, { include: ["images", "reviews", "productTypes", {
        model: Shop,
        as: 'shop', // Alias for the association
        attributes: ['shopName', 'userId'] // Only include the name of the shop
      }] }); // Include related

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error retrieving product:", error);
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  }

  // Add a new product to the database
  static async addProduct(req, res) {
    try {
      const { name, secondaryName, shopId, categories, description, images, reviews, productTypes } = req.body;
  
      // Validate input
      if (!name || !shopId || !categories) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Create a new product
      const newProduct = await Product.create({
        name,
        secondaryName,
        shopId,
        categories,
        description,
      });
  
      // Check if images are provided and associate them with the product
      if (images && Array.isArray(images)) {
        // Create the images and associate with the new product
        const imagePromises = images.map(imageUrl => 
          Image.create({ url: imageUrl, productId: newProduct.productId })
        );
        await Promise.all(imagePromises);
      }
  
      // Check if reviews are provided and associate them with the product
      if (reviews && Array.isArray(reviews)) {
        // Create the reviews and associate with the new product
        const reviewPromises = reviews.map(review => 
          Review.create({ 
            user: review.user, 
            userId: review.userId,
            rating: review.rating, 
            comment: review.comment, 
            date: new Date(), // You can adjust this based on your actual review data
            productId: newProduct.productId 
          })
        );
        await Promise.all(reviewPromises);
      }

      if(productTypes && Array.isArray(productTypes)){
        const productTypePromises = productTypes.map((type)=>
            ProductType.create({
                type: type.type, 
                price: type.price, 
                productId: newProduct.productId,
                quantity: type.quantity
            })
        );
        await Promise.all(productTypePromises);
      }
  
      // Respond with the created product and associated data
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const {
        name,
        secondaryName,
        shopId,
        categories,
        description,
        price,
        images,
        reviews,
        productTypes,
        quantity,
      } = req.body;
  
      // Step 1: Fetch the product by its prodid
      const productToUpdate = await Product.findOne({ where: { productId } });
  
      if (!productToUpdate) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Step 2: Build an object with only the fields that are provided in the request
      const updatedFields = {};
      if (name !== undefined) updatedFields.name = name;
      if (secondaryName !== undefined) updatedFields.secondaryName = secondaryName;
      if (shopId !== undefined) updatedFields.shopId = shopId;
      if (categories !== undefined) updatedFields.categories = categories;
      if (description !== undefined) updatedFields.description = description;
      if (price !== undefined) updatedFields.price = price;
      if (quantity !== undefined) updatedFields.quantity = quantity;
  
      // Step 3: Update main product fields only if they are provided
      if (Object.keys(updatedFields).length > 0) {
        await productToUpdate.update(updatedFields);
      }
  
      // Step 4: Update related images if provided
      if (images && Array.isArray(images)) {
        await Image.destroy({ where: { productId } });
        const imagePromises = images.map(imageUrl =>
          Image.create({ url: imageUrl, productId })
        );
        await Promise.all(imagePromises);
      }
  
      // Step 5: Partial update for related reviews if provided
      if (reviews && Array.isArray(reviews)) {
        for (const review of reviews) {
          if (review.id) {
            // If the review has an ID, try to update it
            const existingReview = await Review.findOne({ where: { id: review.id, productId } });
            if (existingReview) {
              await existingReview.update({
                user: review.user !== undefined ? review.user : existingReview.user,
                rating: review.rating !== undefined ? review.rating : existingReview.rating,
                comment: review.comment !== undefined ? review.comment : existingReview.comment,
                date: review.date || existingReview.date
              });
            } else {
              // If review with given ID doesn't exist, create it
              await Review.create({
                user: review.user,
                userId: review.userId,
                rating: review.rating,
                comment: review.comment,
                date: review.date || new Date(),
                productId
              });
            }
          } else {
            // If no ID, create a new review
            await Review.create({
              user: review.user,
              userId: review.userId,
              rating: review.rating,
              comment: review.comment,
              date: review.date || new Date(),
              productId
            });
          }
        }
      }
  
      // Step 6: Update related product types if provided
      if (productTypes && Array.isArray(productTypes)) {
        await ProductType.destroy({ where: { productId } });
        const productTypePromises = productTypes.map(type =>
          ProductType.create({
            type: type.type,
            price: type.price,
            quantity: type.quantity,
            productId
          })
        );
        await Promise.all(productTypePromises);
      }
  
      // Step 7: Fetch the updated product with related entities
      const updatedProduct = await Product.findOne({
        where: { productId },
        include: ["images", "reviews", "productTypes"]
      });
  
      // Step 8: Respond with the updated product
      res.status(200).json({
        status: "Product updated successfully",
        updatedProduct
      });
  
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product." });
    }
  }
  
  static async updateProductTypes(req, res) {
    try {
      const { productId } = req.params;
      const { productTypes } = req.body;
  
      if (!productTypes || !Array.isArray(productTypes)) {
        return res.status(400).json({ error: "Invalid productTypes format. It must be an array." });
      }
  
      const productExists = await Product.findOne({ where: { productId } });
      if (!productExists) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      for (const type of productTypes) {
        if (type.id) {
          // Update existing productType
          const existingProductType = await ProductType.findOne({ where: { id: type.id, productId } });
          if (existingProductType) {
            await existingProductType.update({
              type: type.type !== undefined ? type.type : existingProductType.type,
              price: type.price !== undefined ? type.price : existingProductType.price,
              quantity: type.quantity !== undefined ? type.quantity : existingProductType.quantity,
            });
          } else {
            return res.status(404).json({ error: `ProductType with ID ${type.id} not found for the given product.` });
          }
        } else {
          // Create a new productType if no ID is provided
          await ProductType.create({
            type: type.type,
            price: type.price,
            quantity: type.quantity,
            productId,
          });
        }
      }
  
      // Fetch the updated product types for response
      const updatedProductTypes = await ProductType.findAll({ where: { productId } });
  
      res.status(200).json({
        status: "ProductTypes updated successfully",
        productTypes: updatedProductTypes,
      });
    } catch (error) {
      console.error("Error updating productTypes:", error);
      res.status(500).json({ error: "Failed to update productTypes." });
    }
  }  
  
  // Delete a product by ID
  static async deleteProduct(req, res) {
    try {
      const { productId } = req.params; // Get the product's prodid from the request parameters
      console.log( productId);
      // Step 1: Check if the product exists
      const productToDelete = await Product.findOne({ where: { productId } });
  
      if (!productToDelete) {
        return res.status(404).json({ error: "Product not found." });
      }
  
      // Step 2: Delete the product
      // Delete related data (images, reviews, product types)
      await Image.destroy({ where: { productId } });
      await Review.destroy({ where: { productId } });
      await ProductType.destroy({ where: { productId } });
  
      // Finally, delete the product itself
      await productToDelete.destroy();
  
      // Step 3: Respond with success
      res.status(200).json({ status: "Product deleted successfully." });
  
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product." });
    }
  }  

  static async deleteAllProducts(req, res) {
    try {
      // Step 1: Find all products
      const products = await Product.findAll();
  
      // Step 2: Delete related data for all products
      for (const product of products) {
        await product.destroy();
      }
  
      // Step 3: Respond with success
      res.status(200).json({ status: "All products deleted successfully." });
    } catch (error) {
      console.error("Error deleting all products:", error);
      res.status(500).json({ error: "Failed to delete all products." });
    }
  }

  static async getProductType(req, res){
    try{
      const { productId } = req.params;
      const { productTypeId } = req.query;
      const productType = await ProductType.findOne({ where: { id: productTypeId, productId } });
      if (productType) {
        return res.status(201).json(productType);
      } else {
        return res.status(404).json({ error: `ProductType with ID ${productTypeId} not found for the given product.` });
      }
    } catch (error) {
      console.error("Error fetching the product type:", error);
      res.status(500).json({ error: "Failed to fetch the product type." });
    }
  }
}

export default ProductController;