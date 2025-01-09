import { productType } from "./interface";

function getIP(){
  return "192.168.1.23";
}
const BASE_URL = "http://" + getIP();

export async function fetchUserData(email: string) {
    try {
      const response = await fetch(`${BASE_URL}:3000/api/user/fetch/${email}`); // Make the request
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

export function getProductType(id: number, productTypes: productType[]){
  return productTypes.find(
    (productType) => productType.id === id 
  ) || null;
}