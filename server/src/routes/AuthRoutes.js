import express from 'express';
import AuthController from '../controllers/AuthController.js';

class AuthRoutes {
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes(){
        // Google OAuth routes
        this.router.get('/google', AuthController.googleLogin); // Initiates Google login
        this.router.get('/google/callback', AuthController.googleCallback); // Handles the Google callback

        // Facebook OAuth routes
        this.router.get('/facebook', AuthController.facebookLogin); // Initiates Facebook login
        this.router.get('/facebook/callback', AuthController.facebookCallback); // Handles the Facebook callback

        // Apple OAuth routes
        this.router.get('/apple', AuthController.appleLogin); // Initiates Apple login (GET request for web)
        this.router.post('/apple/callback', AuthController.appleCallback); // Handles the Apple callback (POST request for iOS)
    }

    getRouter(){
        return this.router;
    }
}

export default new AuthRoutes().getRouter();
