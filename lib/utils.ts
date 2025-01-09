import { productType } from "./interface";

function getIP(){
  return "192.168.1.23";
}
const BASE_URL = "http://" + getIP();

export let userId: string = '';

export async function fetchUserData(email: string) {
  try {
    const response = await fetch(`${BASE_URL}:3000/api/user/fetch/${email}`); // Make the request
    
    if (!response.ok) { // Check for other response statuses
      throw new Error(`Status: ${response.status}`);
    }
    
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    return null;
  }
}


export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}:3000/api/product`); // Make the request
    if (!response.ok) { // Check for response status
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error); // Log any errors
    return null;
  }
}

export async function fetchProductById(productId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/product/${productId}`); // Make the request
    if (!response.ok) { // Check for response status
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error); // Log any errors
    return null;
  }
}

export async function fetchAllCartItems(){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart`); // Make the request
    if (!response.ok) { // Check for response status
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error); // Log any errors
    return null;
  }
}

export async function fetchAllCartItemsByUser(userId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/user/${userId}`); // Make the request
    if (!response.ok) { // Check for response status
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error); // Log any errors
    return null;
  }
}

export function getProductType(id: number, productTypes: productType[]){
  return productTypes.find(
    (productType) => productType.id === id 
  ) || null;
}

export function calculatePriceWithQuantity(quantity: number, price: number){
  return (price * quantity).toFixed(2);
}

export async function updateCartQuantity(quantity: number, cartId: string) {
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return null;
  }
}

export async function addItemToCart(productId: string, productTypeId: number, quantity: number, userId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, productTypeId, quantity, userId }),
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding item to cart: ', error);
    return null;
  }
}