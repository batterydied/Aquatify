import { 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { fetchUserShop } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop

export default function Shop() {
    const { userData } = useUserData();
    const [shop, setShop] = useState<any>(null); // Replace 'any' with your shop interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    const fetchShopData = async () => {
        try {
            const data = await fetchUserShop(userData.id);
            if (data) {
                setShop(data);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData.id) {
            fetchShopData();
        }
    }, [userData.id]);

    const handleCreateShop = () => {
        
    };

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
                <Text style={{ fontFamily: "MontserratRegular" }}>Error fetching shop data.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : (
                <ScrollView className="mt-4 p-4">
                    {shop ? (
                        <View className="bg-white rounded-xl p-4 shadow-sm">
                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                {shop.name}
                            </Text>
                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                {shop.description}
                            </Text>
                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                Created: {new Date(shop.createdAt).toLocaleDateString()}
                            </Text>
                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                Updated: {new Date(shop.updatedAt).toLocaleDateString()}
                            </Text>
                            {/* Add more shop details here */}
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
            )}
        </SafeAreaView>
    );
}