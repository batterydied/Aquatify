import { productType, image } from "./interface";

function getIP(){
  return "192.168.1.23";
}
const BASE_URL = "http://" + getIP();

export let userId: string = '';

export async function getUserData(email: string) {
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


export async function getProducts() {
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

export async function getProductById(productId: string){
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

export async function getAllCartItems(){
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

export async function getAllCartItemsByUser(userId: string){
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
  return Number((price * quantity).toFixed(2));
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

export async function deleteItemFromCart(cartId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting item from cart: ', error);
    return null;
  }
}

export async function deleteAllItemFromCart(userId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting item from cart: ', error);
    return null;
  }
}

export function sortImageById(images: image[]): image[] {
  if (!Array.isArray(images)) {
    throw new Error("Invalid input: images must be an array.");
  }

  return images.sort((a, b) => a.id - b.id);
}

export async function getAllSavedItemsByUserId(userId: string) {
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/saved/user/${userId}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching saved items from cart:', error);
    return null;
  }
}

export async function saveItem(cartId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/save/${cartId}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving items:', error);
    return null;
  }
}

export async function moveItem(cartId: string){
  try {
    const response = await fetch(`${BASE_URL}:3000/api/cart/move/${cartId}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error moving items back to cart:', error);
    return null;
  }
}