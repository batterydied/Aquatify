import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator, useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/utils";
import { homeProduct, filterCriteriaType, categoryTypes } from "@/lib/interface";
import { formatReviewsCount } from "@/lib/reviewFormat";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome } from '@expo/vector-icons';
import { useLockPortraitOrientation } from "@/hooks/useOrientation";

export default function HomePage() {
    useLockPortraitOrientation();
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<homeProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [filterError, setFilterError] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });
    const [currFilterCriteria, setCurrFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });
    const { width, height } = useWindowDimensions();
    
    const router = useRouter();

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
        <View className="flex-1 mx-1 mb-1">
            <TouchableOpacity onPress={() => goToProductPage(item.productId)}>
                <Image
                    source={{ uri: item.images
                        ?.sort((a, b) => (a.id || 0) - (b.id || 0))[0]?.url }}
                    className="h-40 w-full rounded-lg"
                    resizeMode="cover"
                />
                <Text style={{ fontFamily: "MontserratRegular" }}>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</Text>
                <View className="flex-row justify-between">
                    <Text style={{ fontFamily: "MontserratRegular" }}>{'$'+item.price}</Text>
                    <Text style={{ fontFamily: "MontserratRegular" }}>{item.rating % 1 === 0 ? `${item.rating.toFixed(0)}` : `${item.rating.toFixed(1)}`}{'★'}{` (${formatReviewsCount(item.reviews.length)})`}</Text>
                </View>
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
                setHomeProducts((data || []).sort((a: homeProduct, b: homeProduct) => b.rating - a.rating));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
    
        return () => clearInterval(intervalId);
    },[]);
    
    useEffect(() => {
        let filtered = homeProducts;
    
        if (searchQuery) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        filtered = filtered.filter((product) => {
            const matchesMinPrice =
                filterCriteria.minPrice === null || product.price >= filterCriteria.minPrice;
            const matchesMaxPrice =
                filterCriteria.maxPrice === null || product.price <= filterCriteria.maxPrice;
            const matchesRating =
                filterCriteria.minRating === null || product.rating >= filterCriteria.minRating;

            const matchesCategories =
                filterCriteria.categories.length === 0 ||
                filterCriteria.categories.every(category =>
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

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const itemSpacing = 12;
    const desiredItemWidth = 200;
    const itemsPerRow = width / (desiredItemWidth + itemSpacing) >= 2? Math.floor(width / (desiredItemWidth + itemSpacing)) : 2;
    const itemWidth = (width - itemSpacing * (itemsPerRow - 1)) / itemsPerRow - 20;

    return (
        <View className="flex-1 p-5 bg-c3">
            <View className="flex-row items-center mt-16 rounded-md bg-white px-3 mb-4">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <FontAwesome name="list" size={20} color="gray" />
                </TouchableOpacity>
                <TextInput
                    value={searchInput}
                    onChangeText={(text) => setSearchInput(text)}
                    onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
                    placeholder="Search products..."
                    placeholderTextColor="gray"
                    className="flex-1 h-10 pl-2 text-black"
                    style={{ fontFamily: "MontserratRegular" }}
                />
            </View>

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
                            placeholder="Min price"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            value={currFilterCriteria.minPrice?.toString() || ""}
                            onChangeText={(text) =>
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    minPrice: parseFloat(text) || null,
                                })
                            }
                            className={`p-2 border-[1px] border-gray-300 rounded ${!filterError ? "mb-4" : ""}`}
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
                            onChangeText={(text) =>{
                                const numericValue = parseFloat(text);
                                // Ensure the value is between 0 and 5
                                if (!isNaN(numericValue)) {
                                    setCurrFilterCriteria({
                                        ...currFilterCriteria,
                                        minRating: Math.max(0, Math.min(5, numericValue)), // Clamp value between 0 and 5
                                    });
                                } else {
                                    setCurrFilterCriteria({
                                        ...currFilterCriteria,
                                        minRating: null, // Clear value if input is not a valid number
                                    });
                                }
                            }}
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
                        <View className="flex-row w-full">
                            <TouchableOpacity className="w-[40%]"
                                onPress={() => resetFilter()}
                            >
                                <Text className="text-red-500" style={{ fontFamily: "MontserratRegular" }}>Reset filter</Text>
                            </TouchableOpacity>
                            <View className="w-[60%] flex-row justify-end">
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

            <View className="flex-1 items-center">
                <FlatList
                    key={width}
                    data={filteredProducts}
                    keyExtractor={(item: homeProduct) => item.productId}
                    renderItem={({ item }) => (
                        <View style={[{ width: itemWidth }]}>
                            {renderItem({ item })}
                        </View>
                    )}
                    numColumns={itemsPerRow}
                    columnWrapperStyle={itemsPerRow > 1 && { justifyContent: "flex-start" }}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                    bounces = {false}
                />
            </View>
        </View>
    );
}
