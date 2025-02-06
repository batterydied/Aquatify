import { 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Image,
    useWindowDimensions,
    ActivityIndicator,
    FlatList
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { fetchUserShop, getProductsByShopId, sortImageById } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop
import { productGrid, shopInterface } from "@/lib/interface";
import { goToProductPage } from "@/lib/goToProductPage";
import { calculateItemWidthAndRow } from "@/lib/calculateItemWidthAndRow";
import BackArrow from "@/components/BackArrow";
import ProfilePicture from "@/components/ProfilePicture";

export default function Shop() {
    const {userData} = useUserData();
    const {userId} = useLocalSearchParams();
    const userIdString = Array.isArray(userId) ? userId[0] : String(userId);
    const [shop, setShop] = useState<shopInterface | null>(null);
    const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [productGrids, setProductGrids] = useState<productGrid[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<productGrid[]>([]);
    const [shopName, setShopName] = useState("");
    const [shopDescription, setShopDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const {width} = useWindowDimensions();
    const { itemsPerRow, itemWidth } = calculateItemWidthAndRow(12, 200, width);
    const imageWidth = width * 0.25;

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }
    
    useEffect(()=>{
        fetchShopData();
    }, [userData])

    useEffect(() => {
        if (shop && shop.avatarFileURI) {
            setImageUri(shop.avatarFileURI);
            setOriginalImageUri(shop.avatarFileURI);
            setShopName(shop.shopName);
            setShopDescription(shop.description);
        }
    }, [shop]);

    useEffect(() => { 
        fetchProductData();
    }, [shop]);

    const fetchProductData = async () => {
        try {
            if(shop){
                const data = await getProductsByShopId(shop.id);
                setProductGrids((data || []).sort((a: productGrid, b: productGrid) => b.rating - a.rating));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchShopData = async () => {
        try {
            const shopData = await fetchUserShop(userIdString);
            setShop(shopData);
            console.log(shopData);
        } catch (error) {
            console.error("Error fetching shop:", error);
        }
    }

    if (!shop) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const isMyShop = (shopUserId: string) => {
        return shopUserId === userData.id;
    }

    const renderItem = ({ item }: { item: productGrid }) => {
        const images = sortImageById(item.images);

        return (
            <View className="flex-1 mx-1">
                <TouchableOpacity activeOpacity={0.7} onPress={() => goToProductPage(item.productId, "shop")}>
                    <Image
                        source={{ uri: images[0].url }}
                        className="h-[85%] w-full rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="h-[15%]">
                        <Text style={{ fontFamily: "MontserratRegular" }}>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</Text>
                        <View className="flex-row justify-between">
                            <Text style={{ fontFamily: "MontserratRegular" }}>{'$' + item.price}</Text>
                            <Text style={{ fontFamily: "MontserratRegular" }}>{item.rating % 1 === 0 ? `${item.rating.toFixed(0)}` : `${item.rating.toFixed(1)}`}{'★'}{` (${formatReviewsCount(item.reviews.length)})`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    const handleBack = () => router.push("/(tabs)/profile");

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <View>
                <View>
                    <BackArrow handleBack={handleBack}/>
                    <ProfilePicture imageUri={imageUri} imageWidth={imageWidth} name={shopName}/>
                    {isMyShop(shop.userId) && 
                        <View className="w-full flex items-end absolute">
                            <TouchableOpacity activeOpacity={0.7} >
                            <FontAwesome name="cog" color="gray" size={20}/>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <FlatList
                key={width}
                data={filteredProducts}
                keyExtractor={(item: productGrid) => item.productId}
                renderItem={({ item }) => (
                    <View className="mb-4" style={[{ width: itemWidth, height: itemWidth }]}>
                        {renderItem({ item })}
                    </View>
                )}
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