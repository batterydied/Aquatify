import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { homeProduct, fetchProducts, filterCriteriaType, categoryTypes, formatReviewsCount } from "@/lib/utils";
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
    const [orientation, setOrientation] = useState('portrait');
    
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
                setHomeProducts(data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
    
        return () => clearInterval(intervalId);
    }, []);
    
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

    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            if (width > height) {
                setOrientation('landscape');
            } else {
                setOrientation('portrait');
            }
        };

        Dimensions.addEventListener('change', updateOrientation);

        updateOrientation();

        return () => {
            Dimensions.removeEventListener('change', updateOrientation);
        };
    }, []);

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const { width: screenWidth } = Dimensions.get('window');
    const itemSpacing = 12;
    const desiredItemWidth = 200;
    const itemsPerRow = Math.floor(screenWidth / (desiredItemWidth + itemSpacing));
    const itemWidth = (screenWidth - itemSpacing * (itemsPerRow - 1)) / itemsPerRow - 20;

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
                        {/* Filter form goes here */}
                    </View>
                </View>
            </Modal>

            <View className="flex-1 items-center">
                <FlatList
                    key={orientation} // Make numColumns change trigger a re-render
                    data={filteredProducts}
                    keyExtractor={(item: homeProduct) => item.productId}
                    renderItem={({ item }) => (
                        <View style={[{ width: itemWidth }]}>
                            {renderItem({ item })}
                        </View>
                    )}
                    numColumns={itemsPerRow}
                    columnWrapperStyle={itemsPerRow > 1 && { justifyContent: "flex-start" }}
                />
            </View>
        </View>
    );
}
