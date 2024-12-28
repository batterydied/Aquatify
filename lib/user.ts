export interface User{
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

export async function fetchUserData(email: string) {
    try {
      const response = await fetch(`http://192.168.1.23:3000/api/user/fetch/${email}`); // Make the request
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

export interface homeProduct{
  productId: string;
  name: string;
  categories: string[];
  images: image[];
  reviews: review[];
  rating: number;
  price: number;
}

export interface image{
  url: string;
}

export interface review{
  rating: number;
}

export async function fetchProducts() {
  try {
    const response = await fetch(`http://192.168.1.23:3000/api/product`); // Make the request
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

export type filterCriteriaType = {
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  categories: string[];
} & {
  [key: string]: string[] | number | null; // Allow dynamic string keys
};

export const categoryTypes: string[] = ["Livestocks", "Plants", "Materials", "Miscellaneous"];