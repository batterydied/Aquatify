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
import * as ImagePicker from "expo-image-picker";
import EditProfilePictureModal from "@/components/EditProfilePictureModal";

export default function ShopList() {
    const {userData, fetchUserData} = useUserData();
    const [loading, setLoading] = useState(true);
    const [isCreatingShop, setIsCreatingShop] = useState(false);
    const {width} = useWindowDimensions();
    const [shopName, setShopName] = useState<string>("");
    const [shopDescription, setShopDescription] = useState<string>("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const imageWidth = width * 0.25;
    const [isEditingShopImage, setEditingShopImage ] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
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

    const saveImage = (image: string) => {
        setImageUri(image);
        setEditingShopImage(false);
    };

    const uploadImage = async (mode: string) => {
        try {
            let result: ImagePicker.ImagePickerResult;

            if (mode === 'gallery') {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    alert('Permission to access the gallery is required!');
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    alert('Permission to access the camera is required!');
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }

            if (!result.canceled) {
                saveImage(result.assets[0].uri); // Save the new image URI
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading image');
        }
    };

    const removeImage = () => {
        setImageUri(null);
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
                            <EditableProfilePicture imageUri={imageUri} imageWidth={imageWidth} setEdit={setEditingShopImage} style={{
                                marginBottom: 8,
                            }}/>
                           <RoundedTextInput value={shopName} setValue={setShopName} clearValue={clearShopName} placeholder="Enter shop name here" style={{width: "50%"}} maxLength={20}/>
                            {shopNameError && 
                            <View className="px-3">
                                <Text className="text-red-500">You can't leave your shop name blank.</Text>
                            </View>}
                            <Description value={shopDescription} setValue={setShopDescription} placeholder="Enter description here" style={{
                                height: "30%",
                                width: "90%"
                            }}/>
                            <TouchableOpacity activeOpacity={0.7}>
                                <View className="m-4 p-2 bg-orange-400 px-4 rounded-md">
                                    <Text style={{ fontFamily: "MontserratRegular" }}>
                                        Save
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <EditProfilePictureModal visible={isEditingShopImage} onClose={()=>setEditingShopImage(false)} onUpload={uploadImage} onRemove={removeImage}/>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}