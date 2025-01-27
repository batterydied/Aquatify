import { 
    Text, 
    View, 
    TouchableOpacity, 
    ActivityIndicator,
    Modal,
    Image,
    useWindowDimensions
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { fetchUserShop } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop

export default function ShopList() {
    const {userData} = useUserData();
    const [shops, setShops] = useState<any>(null); // Replace 'any' with your shop interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isCreatingShop, setIsCreatingShop] = useState(false);
    const {width} = useWindowDimensions();

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    const fetchShopData = async () => {
        try {
            const data = await fetchUserShop(userData.id);
            if (data) {
                setShops(data);
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
        setIsCreatingShop(true);
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
            <TouchableOpacity
                activeOpacity={0.7}
                className="ml-4 mt-16 mb-0 absolute z-10"
                onPress={() => router.push("/(tabs)/profile")}
            >
                <FontAwesome
                name="arrow-left"
                size={20}
                color="gray"
                className="ml-2" // Adds some margin to the left of the icon
                />
            </TouchableOpacity>
            {loading ? ( // Show loading indicator while data is being fetched
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : 
            <View className="flex-1">
               <TouchableOpacity
                onPress={handleCreateShop}
                activeOpacity={0.7}
                className="bg-c2 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 bottom-1 w-20 h-20 flex items-center justify-center shadow-sm"
                >
                    <FontAwesome name="plus" color="white" size={24} />
                </TouchableOpacity>
                {shops ? (
                <Modal>
                    
                </Modal>
                ) : (
                    <View className="flex-1">
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>
                                You don't have any shops!
                            </Text>
                            <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>
                                Would you like to create one?
                            </Text>
                        </View>
                        <Image
                        className="ml-4"
                        source={require("../../assets/images/cockatiel.png")}
                        style={{
                            width: width * .3,
                            height: width * .18
                        }}
                        />
                    </View>
                )}
            </View>
            }
            <Modal animationType="slide" visible={isCreatingShop}>
                <View className="flex-1 bg-gray-200">
                <TouchableOpacity
                activeOpacity={0.7}
                className="ml-4 mt-16 mb-0 absolute z-10"
                onPress={()=>setIsCreatingShop(false)}
                >
                <FontAwesome
                    name="arrow-left"
                    size={20}
                    color="gray"
                    className="ml-2" // Adds some margin to the left of the icon
                />
                </TouchableOpacity>
                    <View className="flex-1 justify-center items-center"> 
                        <Text>
                            Hey
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}