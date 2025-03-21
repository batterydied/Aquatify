import { 
    View,
    FlatList, 
    TouchableOpacity, 
    TextInput, 
    ActivityIndicator, 
    useWindowDimensions 
} from "react-native";
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/apiCalls";
import { productGrid, filterCriteriaType } from "@/lib/interface";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome } from '@expo/vector-icons';
import { useLockPortraitOrientation } from "@/hooks/useOrientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { calculateItemWidthAndRow } from "@/lib/calculateItemWidthAndRow";
import FlatListItem from "@/components/FlatListItem";
import ProductFilter from "@/components/ProductFilter";

export default function HomePage() {
    useLockPortraitOrientation();
    const [productGrids, setProductGrids] = useState<productGrid[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<productGrid[]>([]);
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
    const { width } = useWindowDimensions();
    const { itemsPerRow, itemWidth } = calculateItemWidthAndRow(12, 200, width);

    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });

    const resetFilter = () => {
        setCurrFilterCriteria({
            minPrice: null,
            maxPrice: null,
            minRating: null,
            categories: [],
        })
    }

    const handleRenderItem = ({item}: { item: productGrid }) => (
        <FlatListItem item={item} path= "home" itemWidth={itemWidth} />
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProductGrids((data || []).sort((a: productGrid, b: productGrid) => b.rating - a.rating));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
    
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        let filtered = productGrids;
    
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
    }, [productGrids, searchQuery, filterCriteria]);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    
    const applyFilters = (newFilters: filterCriteriaType) => {
        if (newFilters.minPrice && newFilters.maxPrice && newFilters.minPrice > newFilters.maxPrice) {
            setFilterError(true);
        } else {
            setFilterError(false);
            setFilterCriteria(newFilters);
            setModalVisible(false);
        }
    };

    const handleCategoryToggle = (category: string) => {
        const index = currFilterCriteria.categories.indexOf(category);
        if (index === -1) {
            setCurrFilterCriteria({
                ...currFilterCriteria,
                categories: [...currFilterCriteria.categories, category]
            })
        } else {
            const newCategories = currFilterCriteria.categories;
            newCategories.splice(index, 1);
            setCurrFilterCriteria({
                ...currFilterCriteria,
                categories: newCategories,
            })
        }
    }

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 p-5 bg-gray-200">
            <View className="flex-row items-center rounded-full bg-white px-3 mb-4">
                <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)}>
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

            <ProductFilter 
            modalVisible={modalVisible} 
            currFilterCriteria={currFilterCriteria}
            setCurrFilterCriteria={setCurrFilterCriteria}
            filterError={filterError}
            handleCategoryToggle={handleCategoryToggle}
            resetFilter={resetFilter}
            setModalVisible={setModalVisible}
            applyFilters={applyFilters}
            />

            <View className="flex-1 items-center">
                <FlatList
                key={width}
                data={filteredProducts}
                keyExtractor={(item: productGrid) => item.productId}
                renderItem={handleRenderItem}
                numColumns={itemsPerRow}
                columnWrapperStyle={itemsPerRow > 1 && { justifyContent: "flex-start" }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                />
            </View>
        </SafeAreaView>
    );
}
