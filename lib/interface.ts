export interface User{
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
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
    id: number;
}

export interface review{
    rating: number;
    user: string;
    comment: string;
    id: number;
    updatedAt: string;
}

export interface productInterface{
    name: string;
    secondaryName: string;
    sellerId: string;
    sellerName: string;
    description: string;
    rating: number;
    images: image[];
    reviews: review[];
    productTypes: productType[];
}
  
export interface productType{
    id: number;
    price: number;
    type: string;
    quantity: number;
}
  
export type filterCriteriaType = {
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
    categories: string[];
} & {
    [key: string]: string[] | number | null; // Allow dynamic string keys
};
  
export const categoryTypes: string[] = ["Livestocks", "Freshwater", "Saltwater", "Invertebrates", "Plants", "Care", "Materials", "Miscellaneous"];