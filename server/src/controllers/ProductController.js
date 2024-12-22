import { ProductModel } from "../models/ProductModel.js";

const { Product, Image, Review, ProductType } = ProductModel.models;

class ProductController {
  constructor() {
    this.model = ProductModel; // Associate the controller with the ProductModel abstraction
  }

  // Retrieve all products from the database, including related images
  async getAllProducts(req, res) {
    try {
        const products = await Product.findAll({ include: ["Images", "Reviews", "ProductTypes"] });// Include related
        res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
  }

  // Retrieve a specific product by ID, including related images
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, { include: ["Images", "Reviews", "ProductTypes"] }); // Include related

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
  async addProduct(req, res) {
    try {
      const { name, secondaryname, sellerid, sellername, category, description, price, images, reviews, producttypes, quantity } = req.body;
  
      // Validate input
      if (!name || !sellerid || !sellername || !category || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Create a new product
      const newProduct = await Product.create({
        name,
        secondaryname,
        sellerid,
        sellername,
        category,
        description,
        price,
        quantity,
      });
  
      // Check if images are provided and associate them with the product
      if (images && Array.isArray(images)) {
        // Create the images and associate with the new product
        const imagePromises = images.map(imageUrl => 
          Image.create({ url: imageUrl, productId: newProduct.prodid })
        );
        await Promise.all(imagePromises);
      }
  
      // Check if reviews are provided and associate them with the product
      if (reviews && Array.isArray(reviews)) {
        // Create the reviews and associate with the new product
        const reviewPromises = reviews.map(review => 
          Review.create({ 
            user: review.user, 
            rating: review.rating, 
            comment: review.comment, 
            date: new Date(), // You can adjust this based on your actual review data
            productId: newProduct.prodid 
          })
        );
        await Promise.all(reviewPromises);
      }

      if(producttypes && Array.isArray(producttypes)){
        const productTypePromises = producttypes.map((type)=>
            ProductType.create({
                type: type.type, 
                price: type.price, 
                productId: newProduct.prodid
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

  async updateProduct(req, res) {
    try {
      const { prodid } = req.params;
      const {
        name,
        secondaryname,
        sellerid,
        sellername,
        category,
        description,
        price,
        images,
        reviews,
        producttypes,
        quantity,
      } = req.body;
  
      // Step 1: Fetch the product by its prodid
      const productToUpdate = await Product.findOne({ where: { prodid } });
  
      if (!productToUpdate) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Step 2: Build an object with only the fields that are provided in the request
      const updatedFields = {};
      if (name !== undefined) updatedFields.name = name;
      if (secondaryname !== undefined) updatedFields.secondaryname = secondaryname;
      if (sellerid !== undefined) updatedFields.sellerid = sellerid;
      if (sellername !== undefined) updatedFields.sellername = sellername;
      if (category !== undefined) updatedFields.category = category;
      if (description !== undefined) updatedFields.description = description;
      if (price !== undefined) updatedFields.price = price;
      if (quantity !== undefined) updatedFields.quantity = quantity;
  
      // Step 3: Update main product fields only if they are provided
      if (Object.keys(updatedFields).length > 0) {
        await productToUpdate.update(updatedFields);
      }
  
      // Step 4: Update related images if provided
      if (images && Array.isArray(images)) {
        await Image.destroy({ where: { productId: prodid } });
        const imagePromises = images.map(imageUrl =>
          Image.create({ url: imageUrl, productId: prodid })
        );
        await Promise.all(imagePromises);
      }
  
      // Step 5: Partial update for related reviews if provided
      if (reviews && Array.isArray(reviews)) {
        for (const review of reviews) {
          if (review.id) {
            // If the review has an ID, try to update it
            const existingReview = await Review.findOne({ where: { id: review.id, productId: prodid } });
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
                rating: review.rating,
                comment: review.comment,
                date: review.date || new Date(),
                productId: prodid
              });
            }
          } else {
            // If no ID, create a new review
            await Review.create({
              user: review.user,
              rating: review.rating,
              comment: review.comment,
              date: review.date || new Date(),
              productId: prodid
            });
          }
        }
      }
  
      // Step 6: Update related product types if provided
      if (producttypes && Array.isArray(producttypes)) {
        await ProductType.destroy({ where: { productId: prodid } });
        const productTypePromises = producttypes.map(type =>
          ProductType.create({
            type: type.type,
            price: type.price,
            productId: prodid
          })
        );
        await Promise.all(productTypePromises);
      }
  
      // Step 7: Fetch the updated product with related entities
      const updatedProduct = await Product.findOne({
        where: { prodid },
        include: ["Images", "Reviews", "ProductTypes"]
      });
  
      // Step 8: Respond with the updated product
      res.status(200).json({
        status: "Product updated successfully",
        updatedProduct
      });
  
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
  
  
  // Delete a product by ID
  async deleteProduct(req, res) {
    try {
      const { prodid } = req.params; // Get the product's prodid from the request parameters
  
      // Step 1: Check if the product exists
      const productToDelete = await Product.findOne({ where: { prodid } });
  
      if (!productToDelete) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Step 2: Delete the product
      // Delete related data (images, reviews, product types)
      await Image.destroy({ where: { productId: prodid } });
      await Review.destroy({ where: { productId: prodid } });
      await ProductType.destroy({ where: { productId: prodid } });
  
      // Finally, delete the product itself
      await productToDelete.destroy();
  
      // Step 3: Respond with success
      res.status(200).json({ status: "Product deleted successfully" });
  
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }  
}

export default new ProductController();