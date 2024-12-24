import express from 'express';
import AuthController from '../controllers/AuthController.js';

class AuthRoutes {
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes(){
        this.router.get('/login', AuthController.logIn)
    }

    getRouter(){
        return this.router;
    }
}

export default new AuthRoutes().getRouter();
