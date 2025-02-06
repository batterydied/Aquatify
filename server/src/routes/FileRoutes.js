import express from "express";
import FileController from "../controllers/FileController.js";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/')); // Correct path using ES Modules
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Custom filename (timestamp + original name)
    },
  });

const upload = multer({ storage });

class FileRoutes {
  /**
   * Constructor for FileRoutes.
   * Initializes the Express Router and sets up routes.
   */
  constructor() {
    this.router = express.Router(); // Initialize the router
    this.initializeRoutes(); // Define all routes
  }

  /**
   * Define all cart-related API routes.
   */
  initializeRoutes() {
    this.router.get("/", FileController.retrieveAllFiles);
    this.router.post("/upload", upload.single("file"), FileController.upload);
    this.router.get("/:filename", FileController.retrieveFile);
    this.router.delete("/:filename", FileController.deleteFile);
  }

  /**
   * Return the configured router instance.
   * @returns {Router} - Express Router instance with all cart routes.
   */
  getRouter() {
    return this.router;
  }
}

// Export the CartRoutes instance
export default new FileRoutes().getRouter();
