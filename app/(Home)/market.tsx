import { View, Text, Image, FlatList } from "react-native";
import { homeProduct, fetchProducts } from "@/lib/user";
import { useEffect, useState } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import the hook

export default function Market() {
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const renderItem = ({ item }: { item: homeProduct }) => (
        <View className="flex-1 mx-2 mb-4">
            {/* Product Image */}
            <Image
                source={{ uri: item.images[0]?.url }}
                className="w-full h-32"
                resizeMode="contain"
            />
            {/* Product Name */}
            <Text className="mt-2 text-center">{item.name}</Text>
        </View>
    );

    useFocusEffect(() => {
        if (!isDataFetched) {
            const fetchData = async () => {
                try {
                    const data = await fetchProducts(); // Fetch products
                    setHomeProducts(data || []); // Ensure data is an array, fallback to empty array if null
                    setIsDataFetched(true); // Mark data as fetched
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };

            fetchData();
        }
    });
    return (
        <FlatList
            data={homeProducts}
            keyExtractor={(item: homeProduct) => item.productId}
            numColumns={2} // Ensures two items per row
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: "space-between" }} // Aligns items properly in rows
            contentContainerStyle={{ padding: 16 }} // Adds padding around the grid
        />
    );
}
