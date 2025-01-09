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
  
export type reviewSortOption = {
    label: string;
    value: string;
}

export const reviewSortOptionArray: reviewSortOption[] = [
    {label: 'Sort by Date (Newest)', value: 'sortByDateNewest'},  // Sort by date, newest first
    {label: 'Sort by Date (Oldest)', value: 'sortByDateOldest'},   // Sort by date, oldest first
    {label: 'Sort by Stars (Highest)', value: 'sortByStarsHighest'}, // Sort by stars, highest first
    {label: 'Sort by Stars (Lowest)', value: 'sortByStarsLowest'}  // Sort by stars, lowest first
];


export const categoryTypes: string[] = ["Livestocks", "Freshwater", "Saltwater", "Invertebrates", "Plants", "Care", "Materials", "Miscellaneous"];

export interface cartItem{
    id: string;
    productTypeId: number;
    quantity: number;
    isSaved: boolean;
    Product: productInterface;
}