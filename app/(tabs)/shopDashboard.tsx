import { 
    View, 
    TouchableOpacity, 
    ActivityIndicator,
    Modal,
    Image,
    useWindowDimensions,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect } from "expo-router";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import BackArrow from "@/components/BackArrow";
import RoundedTextInput from "@/components/RoundedTextInput";
import EditableDescription from "@/components/EditableDescription";
import * as ImagePicker from "expo-image-picker";
import EditProfilePictureModal from "@/components/EditProfilePictureModal";
import { createShop } from "@/lib/apiCalls";
import CreateShopButton from "@/components/PlusButton";
import ErrorText from "@/components/ErrorText";
import CustomText from "@/components/CustomText";

export default function ShopList() {
    const {userData, fetchUserData} = useUserData();
    const [loading, setLoading] = useState(true);
    const [isCreatingShop, setIsCreatingShop] = useState(false);
    const {width} = useWindowDimensions();
    const [shopName, setShopName] = useState<string>("");
    const [shopDescription, setShopDescription] = useState<string>("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isEditingShopImage, setEditingShopImage ] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    const imageWidth = width * 0.25;
    const iconWidth = width * 0.15;
    

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

    const handleBack = () => {router.push("/(tabs)/profile")};

    const exitingCreatingShop = ()=>setIsCreatingShop(false);


    const clearShopName = () => {
        setShopName("");
    }

    const handleCreateShop = async () => {
        if (shopName === "") {
            setShopNameError(true);
            return;
        }
        try {
            await createShop(imageUri, shopName, shopDescription, userData.id);
            setIsCreatingShop(false);
            goToShop();
        } catch (error) {
            console.error("Error creating shop:", error);
            alert("Failed to create shop. Try another shop name");
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
                        <CustomText 
                        style={{fontSize: 30}}
                        text="You don't have any shops!"
                        />
                        <CustomText 
                        style={{fontSize: 30}}
                        text="Would you like to create one?"
                        />
                    </View>
                    <Image
                    className="ml-4"
                    source={require("../../assets/images/cockatiel.png")}
                    style={{
                        width: width * .3,
                        height: width * .18
                    }}
                    />
                    <CreateShopButton size={iconWidth} style={{
                        position: "absolute",
                        left: "50%",
                        transform: [{ translateX: '-50%' }],
                        bottom: 1
                    }} setter={setIsCreatingShop}/>
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
                            <ErrorText message="You can't leave your shop name blank."
                            style={{
                                paddingBottom: 8
                            }}/>}
                            <EditableDescription value={shopDescription} setValue={setShopDescription} placeholder="Enter description here" style={{
                                height: "30%",
                                width: "90%"
                            }}/>
                            <TouchableOpacity activeOpacity={0.7} onPress={handleCreateShop}>
                                <View className="m-4 p-2 bg-orange-400 px-4 rounded-md">
                                    <CustomText text="Save"/>
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