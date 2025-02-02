import { 
    Text, 
    View, 
    TouchableOpacity, 
    ActivityIndicator,
    Modal,
    Image,
    useWindowDimensions,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect } from "expo-router";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import BackArrow from "@/components/BackArrow";
import RoundedTextInput from "@/components/RoundedTextInput";
import Description from "@/components/Description";

export default function ShopList() {
    const {userData, fetchUserData} = useUserData();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isCreatingShop, setIsCreatingShop] = useState(false);
    const {width} = useWindowDimensions();
    const [shopName, setShopName] = useState<string>("");
    const [shopDescription, setShopDescription] = useState<string>("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const imageWidth = width * 0.25;
    const [isEditingProfilePicture, setEditingProfilePicture ] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
                <Text style={{ fontFamily: "MontserratRegular" }}>Error fetching shop data.</Text>
            </SafeAreaView>
        );
    }

    const goToShop = ()=>{
        router.replace({
            pathname: "/(tabs)/shop",
            params: {
                userId: userData.id
            },
        });
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    useEffect(()=>{
        if(userData) setLoading(false);
    }, [userData]);

    useEffect(()=>{
        if (userData.hasShop) goToShop();
    }, [userData])

    const handleBack = () => router.push("/(tabs)/profile");

    const exitingCreatingShop = ()=>setIsCreatingShop(false);


    const clearShopName = () => {
        setShopName("");
    }

    const saveChanges = async () => {
        if (shopName === "") {
            setShopNameError(true);
            return;
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <BackArrow handleBack={handleBack} />
            {loading ? ( // Show loading indicator while data is being fetched
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : 
            <View className="flex-1">
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
                    <TouchableOpacity
                    onPress={()=>setIsCreatingShop(true)}
                    activeOpacity={0.7}
                    className="bg-c2 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10 bottom-1 w-20 h-20 flex items-center justify-center shadow-sm"
                    >
                        <FontAwesome name="plus" color="white" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
            }
            <Modal animationType="slide" visible={isCreatingShop}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View className="flex-1 bg-gray-200">
                        <BackArrow handleBack={exitingCreatingShop}
                        style={{
                            marginTop: 64,
                            position: 'absolute',
                            zIndex: 10, 
                        }}
                        />
                        <View className="flex-1 justify-center items-center"> 
                            <EditableProfilePicture imageUri={imageUri} imageWidth={imageWidth} setEdit={setEditingProfilePicture} style={{
                                marginBottom: 16,
                            }}/>
                           <RoundedTextInput value={shopName} setValue={setShopName} clearValue={clearShopName} placeholder="Enter shop name here" style={{width: "80%"}} maxLength={20}/>
                            {shopNameError && 
                            <View className="px-3">
                                <Text className="text-red-500">You can't leave your username blank.</Text>
                            </View>}
                            <Description value={shopDescription} setValue={setShopDescription} placeholder="Enter description here"/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}