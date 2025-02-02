import { router } from "expo-router";

export const goToProductPage = (productId: string, from: string, orderId: string | null = null) => {
    router.push({
        pathname: "/(tabs)/product" as any,
        params: {
           productId,
           fromPage: `/(tabs)/${from}`
        }
    });
};