
    import express from "express";
    import ProductController from "../controllers/ProductController.js";
    
    class ProductRoutes {
        constructor() {
        this.router = express.Router();
        this.initializeRoutes();
        }
    
        initializeRoutes() {
        // Fetch all products
        this.router.get("/", ProductController.getAllProducts);
    
        // Fetch a single product by ID
        this.router.get("/:id", ProductController.getProductById);
    
        // Add a new product
        this.router.post("/", ProductController.addProduct);
    
        // Update an existing product
        this.router.put("/:id", ProductController.updateProduct);
            
        // Delete all products
        this.router.delete("/", ProductController.deleteAllProducts);
        
        // Delete a product by ID
        this.router.delete("/:id", ProductController.deleteProduct);
        }

         /**
         * Return the configured router instance.
         * @returns {Router} - Express Router instance with all cart routes.
         */
        getRouter(){
            return this.router;
        }
    }
    
    // Export the ProductRoutes instance
    export default new ProductRoutes().getRouter();