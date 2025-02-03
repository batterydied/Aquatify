import { productType, image, address, addressData, paymentMethodData, cartItem } from "./interface";
import { extractFilename } from "./extractFilename";
import axios from 'axios';
import { __IP } from "../GLOBAL"

function getIP() {
  return __IP;
}

export const BASE_URL = "http://" + getIP() + ":3000";

export async function getUserData(email: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/fetch/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function getProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/api/product`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export async function getProductById(productId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function getAllCartItems() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cart`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return null;
  }
}

export async function getAllCartItemsByUser(userId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/cart/user/${userId}`);
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
    const response = await axios.put(`${BASE_URL}/api/cart/${cartId}`, {
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
    const response = await axios.post(`${BASE_URL}/api/cart`, {
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
    const response = await axios.delete(`${BASE_URL}/api/cart/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    return null;
  }
}

export async function deleteAllItemFromCart(userId: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/cart/user/${userId}`);
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
    const response = await axios.get(`${BASE_URL}/api/cart/saved/user/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function saveItem(cartId: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/save/${cartId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function moveItem(cartId: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/move/${cartId}`);
    if (response.status === 404) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error moving items back to cart:', error);
    return null;
  }
}

export async function uploadAvatar(previousUri: string | null, uri: string | null, id: string) {
  try {
    if (previousUri) {
      try {
        await axios.delete(`${BASE_URL}/api/file/${extractFilename(previousUri)}`);
        console.log("Previous avatar deleted successfully");
      } catch (error) {
        console.error("Error deleting previous avatar:", error);
      }
    }
    if(uri){
      const formData = new FormData();
      formData.append("file", { uri: uri, name: "profile-image.png", type: "image/png" } as any);

      const response = await axios.post(`${BASE_URL}/api/file/upload/avatar/${id}`, formData);
      return response.data;
    }else{
      await axios.delete(`${BASE_URL}/api/user/avatar/${id}`);
      return null;
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
}

export async function deleteAvatar(id: string, uri: string){
  try{
    const response = await axios.post(`${BASE_URL}/api/file/delete/avatar/${id}`);
    return response.data;
  }catch(error){
    console.error("Error deleting avatar:", error);
    return null;
  }
}

export async function updateUsername(name: string, id: string) {
  try {
    const response = await axios.put(`${BASE_URL}/api/user/${id}`,{
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
}

export async function fetchAddresses(userId: string){
  try {
      const response = await axios.get(`${BASE_URL}/api/address/user/${userId}`);  
      return response.data;
  } catch (error) {
    console.error(error);
    return null;
  } 
};

export async function saveEditedAddress(selectedAddress: address){
  try {
    const response = await axios.put(`${BASE_URL}/api/address/${selectedAddress.id}`, 
        selectedAddress,
    );
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function addNewAddress(address: address){
  try {
    const response = await axios.post(`${BASE_URL}/api/address`, address);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function deleteAddress(addressId: string){
  try {
    const response = await axios.delete(`${BASE_URL}/api/address/${addressId}`);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function fetchPaymentMethods(userId: string){
  try {
    const response = await axios.get(`${BASE_URL}/api/user/payments/${userId}`);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function addPaymentMethod(userId: string, payment: paymentMethodData){
  try {
    const response = await axios.post(`${BASE_URL}/api/user/payments/${userId}`, payment);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function updatePaymentMethod(userId: string, paymentMethodId: string, payment: paymentMethodData){
  try {
    const response = await axios.put(`${BASE_URL}/api/user/payments/${userId}/${paymentMethodId}`, payment);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function deletePaymentMethod(userId: string, paymentMethodId: string){
  try {
    const response = await axios.delete(`${BASE_URL}/api/user/payments/${userId}/${paymentMethodId}`);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function placeOrder(userId: string, address: addressData, cartItems: cartItem[], {subtotal, tax, total}:{subtotal: number, tax: number, total: number}){
  try {
    const products = await Promise.all(cartItems.map(async (cartItem)=>{
      const productId = cartItem.Product.productId;
      const productTypeId = cartItem.productTypeId;
      const response = await axios.get(`${BASE_URL}/api/product/${productId}/productType`,{
        params: { productTypeId }
      });
      const productType = response.data
      return {
        productId,
        productTypeId,
        quantity: cartItem.quantity,
        priceAtTimeOfOrder: productType.price
      }
    }))
    const orderInfo = {
      userId,
      name: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      streetAddress2: address.streetAddress2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      tax: tax,
      subtotal: subtotal,
      totalPrice: total,
      products
    }
    console.log(orderInfo);
    const response = await axios.post(`${BASE_URL}/api/order`, orderInfo);
    return response.data;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function fetchOrders(userId: string){
  try{
    const response = await axios.get(`${BASE_URL}/api/order/user/${userId}`);
    return response.data
  }catch(error){
    console.error(error);
    return null;
  }
}

export async function fetchUserShop(userId: string){
  try{
    const response = await axios.get(`${BASE_URL}/api/shop/user/${userId}`);
    return response.data
  }catch(error){
    console.error(error);
    return null;
  }
}

export async function getProductsByShopId(shopId: string){
  try{
    const response = await axios.get(`${BASE_URL}/api/shop/${shopId}/products`);
    return response.data
  }catch(error){
    console.error(error);
    return null;
  }
}

export async function createShop(imageUri: string | null, shopName: string, shopDescription: string, userId: string){
  try{
    const response = await axios.post(`${BASE_URL}/api/shop`, {
      shopName,
      description: shopDescription,
      userId,
      avatarFileUri: imageUri
    });
    return response.data
  }catch(error){
    console.log(error);
    return null;
  }
}

