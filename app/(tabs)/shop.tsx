import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image,
    useWindowDimensions,
    ActivityIndicator,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { fetchUserShop, getProductsByShopId, sortImageById, updateShopDescription, updateShopName, uploadShopAvatar } from "@/lib/apiCalls"; // Assuming you have an API call to fetch the user's shop
import { productGrid, shopInterface } from "@/lib/interface";
import { goToProductPage } from "@/lib/goToProductPage";
import { calculateItemWidthAndRow } from "@/lib/calculateItemWidthAndRow";
import BackArrow from "@/components/BackArrow";
import ProfilePicture from "@/components/ProfilePicture";
import { formatReviewsCount } from "@/lib/reviewFormat";
import EditableDescription from "@/components/EditableDescription";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import RoundedTextInput from "@/components/RoundedTextInput";
import EditProfilePictureModal from "@/components/EditProfilePictureModal";
import * as ImagePicker from "expo-image-picker";

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
                    <View className="w-full flex items-end absolute pr-4">
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>setIsEditingShop(true)}>
                            <FontAwesome name="cog" color="gray" size={28}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <View className="items-center">
                <FlatList
                key={width}
                data={productGrids}
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
            <Modal animationType="slide" visible={showShopDescription} transparent={true}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="flex justify-center items-center bg-gray-200 h-[50%] w-[90%] rounded-md">
                        <Text style={{fontFamily: "MontserratRegular"}}>
                            {shopDescription}
                        </Text>
                    </View>
                    <TouchableOpacity className="mt-4" activeOpacity={0.7} onPress={()=>setShowShopDescription(false)}>
                        <FontAwesome name="times" size={45} color="#454545"/>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal animationType="slide" visible={isEditingShop}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 bg-gray-200">
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
                        <EditableProfilePicture imageUri={imageUri} imageWidth={imageWidth} setEdit={setIsEditingShopAvatar} style={{marginLeft: 16}}/>
                        <RoundedTextInput value={shopName} setValue={setShopName} clearValue={clearShopName} placeholder="Enter shop name here" maxLength={20}/>
                        {shopNameError && 
                        <View className="px-3">
                            <Text className="text-red-500">You can't leave your shop name blank.</Text>
                        </View>}
                    </View>
                </TouchableWithoutFeedback>
                <EditProfilePictureModal visible={isEditingShopAvatar} onClose={()=>setIsEditingShopAvatar(false)} onUpload={uploadImage} onRemove={removeImage}/>
            </Modal>
        </SafeAreaView>
    );
}