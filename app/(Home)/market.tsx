import { View, Text, Image, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { homeProduct, fetchProducts } from "@/lib/user";

export default function Market() {
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);

    const renderItem = ({ item }: { item: homeProduct }) => (
        <View className="flex-1 mx-2 mb-4">
            <Image
                source={{ uri: item.images[0]?.url }}
                className="w-full h-32"
                resizeMode="contain"
            />
            <Text className="mt-2 text-center">{item.name}</Text>
        </View>
    );

    useEffect(() => {
        // Define the function to fetch data
        const fetchData = async () => {
            try {
                const data = await fetchProducts();
                setHomeProducts(data || []); // Update state with the fetched data
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Initial data fetch when the component mounts
        fetchData();
        
         // Set an interval to fetch data every 10 seconds
         const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds

         // Cleanup function to clear the interval when the component unmounts
         return () => clearInterval(intervalId);
     }, []); // Empty dependency array means this effect runs only once when the component mounts

    return (
        <FlatList
            data={homeProducts}
            keyExtractor={(item: homeProduct) => item.productId}
            numColumns={2}
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ padding: 16 }}
        />
    );
}
