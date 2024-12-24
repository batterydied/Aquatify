class AuthController {
  static async logIn(req, res){
    try {
        const { email } = req.params;
  
        if (quantity <= 0) {
          return res.status(400).json({ message: "Quantity must be greater than zero." });
        }
  
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
          return res.status(404).json({ message: "Cart item not found." });
        }
  
        cartItem.quantity = quantity;
        await cartItem.save();
  
        return res.status(200).json({ message: "Cart item updated.", item: cartItem });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update cart item." });
      }
    }
}

export default AuthController;
