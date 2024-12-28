import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { homeProduct, fetchProducts, filterCriteriaType, categoryTypes } from "@/lib/user";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome } from '@expo/vector-icons';

export default function HomePage() {
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<homeProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    //searchInput is a placeholder, when return is pressed, it calls setSearchQuery
    const [searchInput, setSearchInput] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [filterError, setFilterError] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });
    //currFilterCriteria is a placeholder, when the apply button is pressed, it calls setFilterCriteria
    const [currFilterCriteria, setCurrFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });

    const router = useRouter();

    // Load custom fonts
    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });

    const resetFilter = ()=>{
        setCurrFilterCriteria({
            minPrice: null,
            maxPrice: null,
            minRating: null,
            categories: [],
        })
    }

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
            const matchesMinPrice =
                filterCriteria.minPrice === null || product.price >= filterCriteria.minPrice;
            const matchesMaxPrice =
                filterCriteria.maxPrice === null || product.price <= filterCriteria.maxPrice;
            const matchesRating =
                filterCriteria.minRating === null || product.rating >= filterCriteria.minRating;
        
            // Handle categories logic
            const matchesCategories =
                filterCriteria.categories.length === 0 ||
                filterCriteria.categories.some(category =>
                    product.categories.some(productCategory =>
                        productCategory.toLowerCase() === category.toLowerCase()
                    )
                );
        
            return matchesMinPrice && matchesMaxPrice && matchesRating && matchesCategories;
        });
        
        
        setFilteredProducts(filtered);
    }, [homeProducts, searchQuery, filterCriteria]);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    
    const applyFilters = (newFilters: filterCriteriaType) => {
        if(newFilters.minPrice && newFilters.maxPrice && newFilters.minPrice > newFilters.maxPrice){
            setFilterError(true);
        }else{
            setFilterError(false);
            setFilterCriteria(newFilters);
            setModalVisible(false);
        }
    };

    // If fonts are not loaded, show a loading indicator
    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="grey" />
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
                    <FontAwesome name="list" size={20} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-lg w-4/5">
                        <Text className="text-lg font-bold mb-4" style={{ fontFamily: "MontserratBold" }}>Filters</Text>
                        <TextInput
                            placeholder="Min Price"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={currFilterCriteria.minPrice?.toString() || ""}
                            onChangeText={(text) =>
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    minPrice: parseFloat(text) || null,
                                })
                            }
                            className={`p-2 border-[1px] border-gray-300 rounded ${!filterError && "mb-4"}`}
                            style={{ fontFamily: "MontserratRegular" }}
                        />
                        {filterError && (<Text className="text-red-500">Min price can't be higher than max price.</Text>)}
                        <TextInput
                            placeholder="Max price"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={currFilterCriteria.maxPrice?.toString() || ""}
                            onChangeText={(text) =>
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    maxPrice: parseFloat(text) || null,
                                })
                            }
                            className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                            style={{ fontFamily: "MontserratRegular" }}
                        />
                        <TextInput
                            placeholder="Min rating"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={currFilterCriteria.minRating?.toString() || ""}
                            onChangeText={(text) =>
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    minRating: parseFloat(text) || null,
                                })
                            }
                            className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                            style={{ fontFamily: "MontserratRegular" }}
                        />
                        <Text style={{ fontFamily: "MontserratBold" }}>Categories:</Text>
                        <View className="mb-4">
                            {categoryTypes.map((category)=>(
                                <TouchableOpacity key={category}><Text className={currFilterCriteria.categories.includes(category) ? "text-blue-500" : "text-black"} onPress={()=>{
                                        const index = currFilterCriteria.categories.indexOf(category);
                                        if(index === -1){
                                            setCurrFilterCriteria({
                                            ...currFilterCriteria,
                                            categories: [...currFilterCriteria.categories, category]
                                            })
                                        }else{
                                            const newCategories = currFilterCriteria.categories;
                                            newCategories.splice(index, 1);
                                            setCurrFilterCriteria({
                                                ...currFilterCriteria,
                                                categories: newCategories,
                                            })
                                        }
                                    }}>{category}</Text></TouchableOpacity>
                            ))}
                        </View>
                        <View className="flex-row">
                            <TouchableOpacity
                                onPress={() => resetFilter()}
                            >
                                <Text className="text-red-500" style={{ fontFamily: "MontserratRegular" }}>Reset filter</Text>
                            </TouchableOpacity>
                            <View className="w-[75%] flex-row justify-end">
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="mr-4"
                                >
                                    <Text className="text-gray-600" style={{ fontFamily: "MontserratRegular" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>applyFilters(currFilterCriteria)}>
                                    <Text className="text-blue-600" style={{ fontFamily: "MontserratRegular" }}>Apply</Text>
                                </TouchableOpacity>
                            </View>
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
