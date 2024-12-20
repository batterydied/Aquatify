import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { handleGlobalError } from "./utils/errorHandler.js";
import cors from "cors";
import { connectToDatabase } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.dirname(__dirname);

const port = process.env.PORT

//import UserRoutes from './routes/UserRoutes.js';
//import CartRoutes from './routes/CartRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
//import OrderRoutes from './routes/OrderRoutes.js';
 
dotenv.config();

class Server{
  constructor(){
    this.app = express();
    this.middleware = this.configureMiddleware();
    this.setupRoutes();
  }
  configureMiddleware(){
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({
      origin: "http://127.0.0.1:8081", // Allow the frontend for communication
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true,
    }));
  }
  setupRoutes() {
    console.log("Registering routes...");

    // this.app.use('/api/user', (req, res, next) => {
    //   console.log(`Route hit: ${req.method} ${req.url}`);
    //   next();
    // }, UserRoutes);

    this.app.use('/api/product', (req, res, next) => {
        console.log(`Route hit: ${req.method} ${req.url}`);
        next();
    }, ProductRoutes);

    // this.app.use('/api/cart', (req, res, next) => {
    //     console.log(`Route hit: ${req.method} ${req.url}`);
    //     next();
    // }, CartRoutes);

    // this.app.use('/api/order', (req, res, next) => {
    //     console.log(`Route hit: ${req.method} ${req.url}`);
    //     next();
    // }, OrderRoutes);

    this.app.get('/', (req, res) => {
      res.send("You reached the server.");
    });

    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });

    console.log("Routes successfully registered.");
    
    this.app.use(handleGlobalError);
  }
  start(port = Number(process.env.PORT) || 3000) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

const server = new Server();
server.start();
await connectToDatabase();



