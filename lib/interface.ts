export interface User{
    id: string;
    name: string;
    email: string;
    avatarFileURI: string | null;
    hasShop: boolean;
}

export interface productGrid{
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
    userId: string;
    comment: string;
    id: number;
    updatedAt: string;
}

export interface productInterface{
    name: string;
    productId: string;
    secondaryName: string;
    shopId: string;
    shop: {
        shopName: string,
        userId: string
    };
    description: string;
    rating: number;
    images: image[];
    reviews: review[];
    productTypes: productType[];
    price: number;
}
  
export interface productType{
    id: number;
    price: number;
    type: string;
    quantity: number;
}

export interface initProductType{
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

export interface address{
    id: string;
    userId: string;
    streetAddress: string;
    streetAddress2: string | null;
    name: string;
    phoneNumber: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface addressData{
    streetAddress: string;
    streetAddress2: string | null;
    fullName: string;
    phoneNumber: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface paymentMethod {
    id: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardName: string;
}

export interface paymentMethodData {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardName: string;
}

export interface orderProduct {
    productId: string;
    productTypeId: number;
    productName: string;
    productType: string;
    quantity: number;
    priceAtTimeOfOrder: number;
}

export interface order {
    orderId: string;
    name: string;
    phoneNumber: string;
    streetAddress: string;
    streetAddress2: string;
    city: string;
    state: string;
    zipCode: string;
    totalPrice: number;
    subtotal: number;
    tax: number;
    status: string;
    updatedAt: string;
    createdAt: string;
    orderProducts: orderProduct[];
}

export interface shopInterface {
    id: string;
    shopName: string;
    userId: string;
    description: string;
    avatarFileURI: string;
}

export interface initProduct {
    name: string;
    secondaryName?: string;
    shopId: string;
    categories: string[];
    description?: string;
  
    images?: image[];
    productTypes?: initProductType[];
  }
  