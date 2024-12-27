import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { homeProduct, fetchProducts, filterCriteriaType } from "@/lib/user";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome } from '@expo/vector-icons';

export default function HomePage() {
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<homeProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<filterCriteriaType>({
        price: null,
        rating: null,
        category: "",
    });

    const router = useRouter();

    // Load custom fonts
    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });


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
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
    
        return () => clearInterval(intervalId);
    }, []);
    
    // Reapply filters whenever homeProducts, searchQuery, or filterCriteria change
    useEffect(() => {
        let filtered = homeProducts;
    
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        // Apply additional filters
        filtered = filtered.filter((product) => {
            const matchesPrice =
                filterCriteria.price === null || product.price <= filterCriteria.price;
            const matchesRating =
                filterCriteria.rating === null || product.rating >= filterCriteria.rating;
            const matchesCategory =
                filterCriteria.category === "" || 
                product.category.toLowerCase().includes(filterCriteria.category.toLowerCase());
    
            return matchesPrice && matchesRating && matchesCategory;
        });
    
        setFilteredProducts(filtered);
    }, [homeProducts, searchQuery, filterCriteria]);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    
    const applyFilters = (newFilters: filterCriteriaType) => {
        setFilterCriteria(newFilters);
        setModalVisible(false);
    };

    // If fonts are not loaded, show a loading indicator
    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 mt-16 p-5 bg-c3">
            {/* Search Bar */}
            <View className="flex-row items-center rounded-md bg-white px-3 mb-4">
                <FontAwesome name="search" size={20} color="gray" />
                <TextInput
                    value={searchInput}
                    onChangeText={(text) => setSearchInput(text)}
                    onSubmitEditing={(e)=>handleSearch(e.nativeEvent.text)}
                    placeholder="Search products..."
                    placeholderTextColor="gray"
                    className="flex-1 h-10 pl-2 text-black"
                    style={{ fontFamily: "MontserratRegular" }}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <FontAwesome name="filter" size={20} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-4/5">
                        <Text className="text-lg font-bold mb-4">Filters</Text>
                        <TextInput
                            placeholder="Max Price"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={filterCriteria.price?.toString() || ""}
                            onChangeText={(text) =>
                                setFilterCriteria({
                                    ...filterCriteria,
                                    price: parseFloat(text) || null,
                                })
                            }
                            className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                        />
                        <TextInput
                            placeholder="Min Rating"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={filterCriteria.rating?.toString() || ""}
                            onChangeText={(text) =>
                                setFilterCriteria({
                                    ...filterCriteria,
                                    rating: parseFloat(text) || null,
                                })
                            }
                            className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                        />
                        <TextInput
                            placeholder="Category"
                            placeholderTextColor="grey"
                            value={filterCriteria.category}
                            onChangeText={(text) =>
                                setFilterCriteria({
                                    ...filterCriteria,
                                    category: text,
                                })
                            }
                            className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                        />
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="mr-4"
                            >
                                <Text className="text-gray-600">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={applyFilters}>
                                <Text className="text-blue-600">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
