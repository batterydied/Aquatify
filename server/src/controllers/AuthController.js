class AuthController {
    static async logIn(req, res){
        try {
            const { email } = req.params;
    
            
        } catch (error) {
            res.status(400).json({error: "Failed to fetch "})
        }
    }
}

export default AuthController;
