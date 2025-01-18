import { productType, image } from "./interface";
import axios from 'axios';

function getIP() {
  return "192.168.1.23";
}

const BASE_URL = "http://" + getIP();

export let userId: string = '';

export async function getUserData(email: string) {
  try {
    const response = await axios.get(`${BASE_URL}:3000/api/user/fetch/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function getProducts() {
  try {
    const response = await axios.get(`${BASE_URL}:3000/api/product`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export async function getProductById(productId: string) {
  try {
    const response = await axios.get(`${BASE_URL}:3000/api/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function getAllCartItems() {
  try {
    const response = await axios.get(`${BASE_URL}:3000/api/cart`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return null;
  }
}

export async function getAllCartItemsByUser(userId: string) {
  try {
    const response = await axios.get(`${BASE_URL}:3000/api/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user cart items:', error);
    return null;
  }
}

export function getProductType(productTypeId: number, productTypes: productType[]) {
  return productTypes.find(
    (productType) => productType.id === productTypeId
  ) || null;
}

export function calculatePriceWithQuantity(quantity: number, price: number) {
  return Number((price * quantity).toFixed(2));
}

export async function updateCartQuantity(quantity: number, cartId: string) {
  try {
    const response = await axios.put(`${BASE_URL}:3000/api/cart/${cartId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return null;
  }
}

export async function addItemToCart(productId: string, productTypeId: number, quantity: number, userId: string) {
  try {
    const response = await axios.post(`${BASE_URL}:3000/api/cart`, {
      productId,
      productTypeId,
      quantity,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return null;
  }
}

export async function deleteItemFromCart(cartId: string) {
  try {
    const response = await axios.delete(`${BASE_URL}:3000/api/cart/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    return null;
  }
}

export async function deleteAllItemFromCart(userId: string) {
  try {
    const response = await axios.delete(`${BASE_URL}:3000/api/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all items from cart:', error);
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
    const response = await axios.get(`${BASE_URL}:3000/api/cart/saved/user/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function saveItem(cartId: string) {
  try {
    const response = await axios.post(`${BASE_URL}:3000/api/cart/save/${cartId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function moveItem(cartId: string) {
  try {
    const response = await axios.post(`${BASE_URL}:3000/api/cart/move/${cartId}`);
    if (response.status === 404) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error moving items back to cart:', error);
    return null;
  }
}

export async function uploadAvatar(previousUri: string | null, uri: string) {
  try {
    const formData = new FormData();
    formData.append("file", { uri: uri, name: "profile-image.png", type: "image/png" } as any);

    const response = await axios.post(`${BASE_URL}:3000/api/file/upload`, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
}
