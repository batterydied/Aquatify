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
import { getProductsByShopId, sortImageById } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop
import { productGrid, shopInterface } from "@/lib/interface";
import { goToProductPage } from "@/lib/goToProductPage";

export default function Shop() {
    const {userData} = useUserData();
    const params = useLocalSearchParams()
    const [shop, setShop] = useState<shopInterface | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [productGrids, setProductGrids] = useState<productGrid[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<productGrid[]>([]);

     const {width} = useWindowDimensions();

    const imageWidth = width * 0.25;

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
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

    useEffect(() => {
        if (shop && shop.avatarFileURI) {
            setImage(shop.avatarFileURI);
            setOriginalImage(shop.avatarFileURI);
        }
    }, []);

    const fetchData = async () => {
        try {
            const data = await getProductsByShopId(shop.id);
            setProductGrids((data || []).sort((a: productGrid, b: productGrid) => b.rating - a.rating));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => { 
            fetchData();
    }, []);

    const itemSpacing = 12;
    const desiredItemWidth = 200;
    const itemsPerRow = width / (desiredItemWidth + itemSpacing) >= 2 ? Math.floor(width / (desiredItemWidth + itemSpacing)) : 2;
    const itemWidth = (width - itemSpacing * (itemsPerRow - 1)) / itemsPerRow - 20;

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
    
    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <View>
                <View>
                    <TouchableOpacity
                    activeOpacity={0.7}
                    className="ml-4 mb-0 absolute z-10"
                    onPress={() => router.push("/(tabs)/profile")}
                    >
                    <FontAwesome
                    name="arrow-left"
                    size={20}
                    color="gray"
                    className="ml-2"
                    />
                </TouchableOpacity>
                    <View className="p-4 flex-1 justify-center items-center relative">
                        <Image
                            className="rounded-full border-2 border-gray-400"
                            style={{
                                width: imageWidth,
                                height: imageWidth,
                            }}
                            resizeMode="cover"
                            source={
                                image
                                    ? { uri: image }
                                    : require('../../assets/images/default-avatar-icon.png')
                            }
                        />
                        {isMyShop(shop.userId) && 
                        <View className="w-full flex items-end absolute">
                            <TouchableOpacity activeOpacity={0.7} >
                            <FontAwesome name="cog" color="gray" size={20}/>
                            </TouchableOpacity>
                        </View>
                    }
                        <Text style={{ fontFamily: "MontserratBold" }} className="text-lg p-2">
                            {shop.shopName}
                        </Text>
                    </View>
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