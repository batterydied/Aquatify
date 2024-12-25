import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { homeProduct, fetchProducts } from "@/lib/user";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Market() {
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<homeProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const renderItem = ({ item }: { item: homeProduct }) => (
        <View className="flex-1 mx-2 mb-4">
            <TouchableOpacity onPress={() => goToProductPage(item.productId)}>
                <Image
                    source={{ uri: item.images[0]?.url }}
                    className="w-full h-32"
                    resizeMode="contain"
                />
                <Text className="mt-2 text-center">{item.name}</Text>
            </TouchableOpacity>
        </View>
    );

    const goToProductPage = (productId: string) => {
        router.push(`/(home)/(product)/${productId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProducts();
                setHomeProducts(data || []);
                setFilteredProducts(data || []); // Initialize filtered products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const handleSearch = () => {
        const filtered = homeProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <View className='flex-1 mt-16 p-5 bg-c2'>
            {/* Search Bar */}
            <View className="flex-row items-center border border-black rounded-md bg-white px-3 mb-4">
                <FontAwesome name="search" size={20} color="gray" />
                <TextInput
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    onSubmitEditing={handleSearch}
                    placeholder="Search products..."
                    placeholderTextColor="gray"
                    className="flex-1 h-10 pl-2 text-black"
                />
            </View>
            {/* Product List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item: homeProduct) => item.productId}
                numColumns={2}
                renderItem={renderItem}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
}
