import { 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator,
    Image,
    useWindowDimensions
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { fetchUserShop, getProductsByShopId } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop
import { productGrid, shopInterface } from "@/lib/interface";

export default function Shop() {
    const {userData} = useUserData();
    const params = useLocalSearchParams()
    const shop: shopInterface = typeof params.data === "string" ? JSON.parse(params.data) : {};
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [homeProducts, setHomeProducts] = useState<productGrid[]>([]);

     const {width} = useWindowDimensions();

    const imageWidth = width * 0.25;

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }
    const handleCreateShop = () => {
        
    };

    const isMyShop = (shopUserId: string) => {
        return shopUserId === userData.id;
    }

    useEffect(() => {
        if (shop && shop.avatarFileURI) {
            setImage(shop.avatarFileURI);
            setOriginalImage(shop.avatarFileURI); // Set original image initially
        }
    }, []);

    const fetchData = async () => {
        try {
            const data = await getProductsByShopId(shop.id);
            setHomeProducts((data || []).sort((a: productGrid, b: productGrid) => b.rating - a.rating));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => { 
            fetchData();
        }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <ScrollView>
                {shop ? (
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
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600 text-center mb-4">
                            You don't have any shop.
                        </Text>
                        <TouchableOpacity
                            onPress={handleCreateShop}
                            className="bg-blue-500 rounded-xl p-3"
                        >
                            <Text style={{ fontFamily: "MontserratBold" }} className="text-white">
                                Create Shop
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}