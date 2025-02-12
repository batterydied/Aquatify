import { 
    Text, 
    View, 
    TouchableOpacity, 
    useWindowDimensions,
    ActivityIndicator,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from "react-native";
import { 
    fetchUserShop, 
    getProductsByShopId, 
    updateShopDescription, 
    updateShopName, 
    uploadShopAvatar,
    deleteShop, 
    updateShopStatus 
} from "@/lib/apiCalls";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { productGrid, shopInterface } from "@/lib/interface";
import { calculateItemWidthAndRow } from "@/lib/calculateItemWidthAndRow";
import BackArrow from "@/components/BackArrow";
import ProfilePicture from "@/components/ProfilePicture";
import EditableDescription from "@/components/EditableDescription";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import RoundedTextInput from "@/components/RoundedTextInput";
import EditProfilePictureModal from "@/components/EditProfilePictureModal";
import * as ImagePicker from "expo-image-picker";
import DescriptionModal from "@/components/DescriptionModal";
import FlatListItem from "@/components/FlatListItem";
import AddProductButton from "@/components/PlusButton";
import EditShopButton from "@/components/EditShopButton";
import CreateProductModal from "@/components/CreateProductModal";
import ErrorText from "@/components/ErrorText";

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
    const [previousShopName, setPreviousShopName] = useState("");
    const [shopDescription, setShopDescription] = useState("");
    const [previousShopDescription, setPreviousShopDescription] = useState("");
    const [showShopDescription, setShowShopDescription] = useState(false);
    const [isEditingShop, setIsEditingShop] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);
    const [isEditingShopAvatar, setIsEditingShopAvatar] = useState(false);
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);

    const {width} = useWindowDimensions();
    const { itemsPerRow, itemWidth } = calculateItemWidthAndRow(12, 200, width);
    const imageWidth = width * 0.25;
    const iconWidth = width * 0.15;

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }
    
    useFocusEffect(
        useCallback(() => {
        fetchShopData();
        }, [])
    );

    useEffect(() => {
        if (shop) {
            if (shop.avatarFileURI){
                setImageUri(shop.avatarFileURI);
                setOriginalImageUri(shop.avatarFileURI);
            }
            setShopName(shop.shopName);
            setPreviousShopName(shop.shopName);
            setShopDescription(shop.description);
            setPreviousShopDescription(shop.description);
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
        } catch (error) {
            console.error("Error fetching shop:", error);
        }
    }

    if (!shop) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-200">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const isMyShop = (shopUserId: string) => {
        return shopUserId === userData.id;
    }

    const handleRenderItem = ({item}: { item: productGrid }) => (
        <FlatListItem item={item} path= "shop" itemWidth={itemWidth} />
    );

    const handleBack = () => {router.push("/(tabs)/profile")};

    const discardChanges = () => {
        setImageUri(originalImageUri);
        setShopName(previousShopName);
        setShopDescription(previousShopDescription);
        setIsEditingShop(false);
    };

   const saveChanges = async () => {
        if (shopName === "") {
            setShopNameError(true);
            return;
        }
    
        try {
            if (originalImageUri !== imageUri) {
                const fileURI = await uploadShopAvatar(originalImageUri, imageUri, shop.id);
                if (fileURI) {
                    setOriginalImageUri(imageUri);
                } else {
                    setOriginalImageUri(null); 
                }
            }
            if (previousShopName !== shopName) {
                const shopNameResponse = await updateShopName(shopName, shop.id);
                if (shopNameResponse) {
                    setPreviousShopName(shopName);
                }
            }

            if (previousShopDescription !== shopDescription) {
                const shopNameResponse = await updateShopDescription(shopDescription, shop.id);
                if (shopNameResponse) {
                    setPreviousShopName(shopName);
                }
            }
    
            setShopNameError(false);
            setIsEditingShop(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Failed to save changes. Try another shop name.");
        }
    };

    const clearShopName = () => {
        setShopName("");
    }

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
    
        const saveImage = (image: string) => {
            setImageUri(image);
            setIsEditingShopAvatar(false);
        };

    async function handleDeleteShop(shopId: string, avatarFileURI: string, userId: string) {
        Alert.alert(
            "Delete Shop",
            "Are you sure you want to delete this shop?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try{
                        await deleteShop(shopId, avatarFileURI);
                        await updateShopStatus(userId, false);
                        setIsEditingShop(false);
                        router.push("./profile");
                        }catch{
                            Alert.alert("Error", "Failed to delete shop.");
                        }
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <View>
                <BackArrow handleBack={handleBack} />
                <ProfilePicture imageUri={imageUri} imageWidth={imageWidth} name={shopName}/>
                <TouchableOpacity className="px-4 pb-4" activeOpacity={0.7} onPress={()=>setShowShopDescription(true)}>
                    <View>
                        <Text className="text-blue-500">
                            More info
                        </Text>
                    </View>
                </TouchableOpacity>
                {isMyShop(shop.userId) && 
                    <EditShopButton setter={setIsEditingShop}/>
                }
            </View>
            <View className="items-center">
                <FlatList
                key={width}
                data={productGrids}
                keyExtractor={(item: productGrid) => item.productId}
                renderItem={handleRenderItem}
                numColumns={itemsPerRow}
                columnWrapperStyle={itemsPerRow > 1 && { justifyContent: "flex-start" }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={true}
                />
            </View>
            {isMyShop(shop.userId) && 
                <AddProductButton style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }} 
                size={iconWidth}
                setter={setIsCreatingProduct}
                 />
            }
            <DescriptionModal visible={showShopDescription} description={shopDescription} setter={setShowShopDescription} />
            <Modal animationType="slide" visible={isEditingShop}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 bg-gray-200 items-center">
                        <View className="mt-16 flex-row w-full justify-between px-4">
                            <TouchableOpacity onPress={discardChanges}>
                                <View className="rounded-lg m-2">
                                    <FontAwesome name="times" color="gray" size={30} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveChanges}>
                                <View className="rounded-lg m-2">
                                    <Text className="text-blue-500 text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                        Save
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <EditableProfilePicture imageUri={imageUri} imageWidth={imageWidth} setEdit={setIsEditingShopAvatar} />
                        <RoundedTextInput value={shopName} setValue={setShopName} clearValue={clearShopName} placeholder="Enter shop name here" maxLength={20} style={{width: "60%"}}/>
                        {shopNameError && 
                        <ErrorText style={{
                            padding: 12
                        }}
                        message="You can't leave your shop name blank."/>}
                        <EditableDescription value={shopDescription} setValue={setShopDescription} placeholder="Enter shop description here" maxLength={200} style={{padding: 8, height: "30%", width: "90%"}}/>
                        <View className="flex w-full items-center">
                            <TouchableOpacity activeOpacity={0.7} className="m-4" onPress={()=> handleDeleteShop(shop.id, shop.avatarFileURI, userData.id)}>
                                <View className="bg-red-500 rounded-xl p-4 flex-row items-center">
                                    <FontAwesome name="trash" size={20} color="white" className="mr-2"/>
                                    <Text className="text-white" style={{ fontFamily: "MontserratBold" }}>Delete my shop</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <EditProfilePictureModal visible={isEditingShopAvatar} onClose={()=>setIsEditingShopAvatar(false)} onUpload={uploadImage} onRemove={removeImage}/>
            </Modal>
            <CreateProductModal visible={isCreatingProduct} onClose={()=>setIsCreatingProduct(false)} onSubmit={(product: any)=>{}}/>
        </SafeAreaView>
    );
}