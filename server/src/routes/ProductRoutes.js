
    import express from "express";
    import ProductController from "../controllers/ProductController.js";
    
    class ProductRoutes {
        constructor() {
        this.router = express.Router();
        this.initializeRoutes();
        }
    
        initializeRoutes() {
        // Fetch all products
        this.router.get("/", (req, res) => ProductController.getAllProducts(req, res));
    
        // Fetch a single product by ID
        this.router.get("/:id", (req, res) => ProductController.getProduct(req, res));
    
        // Add a new product
        this.router.post("/", (req, res) => ProductController.addProduct(req, res));
    
        // Update an existing product
        this.router.put("/:prodid", (req, res) => ProductController.updateProduct(req, res));
    
        // Delete a product by ID
        this.router.delete("/:prodid", (req, res) => ProductController.deleteProduct(req, res));
        }
    }
    
    export default new ProductRoutes().router; // Export the router instance