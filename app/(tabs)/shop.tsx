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
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { fetchUserShop } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop
import { shopInterface } from "@/lib/interface";

export default function Shop() {
    const {userData} = useUserData();
    const params = useLocalSearchParams()
    const shop: shopInterface = typeof params.data === "string" ? JSON.parse(params.data) : {};
    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }
    const handleCreateShop = () => {
        
    };

    const isMyShop = (shopUserId: string) => {
        return shopUserId === userData.id;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <ScrollView className="mt-4 p-4">
                {shop ? (
                    <View>
                        <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                            {shop.shopName}
                        </Text>
                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                            {shop.description}
                        </Text>
                        {isMyShop(shop.userId) && 
                            <TouchableOpacity activeOpacity={0.7}>
                               <FontAwesome name="cog" color="gray" size={20}/>
                            </TouchableOpacity>
                        }
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