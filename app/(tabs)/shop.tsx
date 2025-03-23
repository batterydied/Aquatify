import { 
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
import { filterCriteriaType, productGrid, shopInterface } from "@/lib/interface";
import { calculateItemWidthAndRow } from "@/lib/calculateItemWidthAndRow";
import BackArrow from "@/components/BackArrow";
import ProfilePicture from "@/components/ProfilePicture";
import EditableDescription from "@/components/EditableDescription";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import RoundedTextInput from "@/components/RoundedTextInput";
import EditProfilePictureModal from "@/components/UploadImageOptionModal";
import DescriptionModal from "@/components/DescriptionModal";
import FlatListItem from "@/components/FlatListItem";
import AddProductButton from "@/components/PlusButton";
import EditShopButton from "@/components/CogButton";
import CreateProductModal from "@/components/CreateProductModal";
import ErrorText from "@/components/ErrorText";
import ProductFilter from "@/components/ProductFilter";
import CustomText from "@/components/CustomText";
import { isMyShop } from "@/lib/validation";
import { uploadImage } from "@/lib/imageUpload";
import { BASE_URL } from "@/lib/apiCalls";

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
    const [modalVisible, setModalVisible] = useState(false);
    const [filterError, setFilterError] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });
    const [currFilterCriteria, setCurrFilterCriteria] = useState<filterCriteriaType>({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        categories: [],
    });

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
                setImageUri(BASE_URL+shop.avatarFileURI);
                setOriginalImageUri(BASE_URL+shop.avatarFileURI);
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

    useEffect(() => {
        let filtered = productGrids;
    
        filtered = filtered.filter((product) => {
            const matchesMinPrice =
                filterCriteria.minPrice === null || product.price >= filterCriteria.minPrice;
            const matchesMaxPrice =
                filterCriteria.maxPrice === null || product.price <= filterCriteria.maxPrice;
            const matchesRating =
                filterCriteria.minRating === null || product.rating >= filterCriteria.minRating;

            const matchesCategories =
                filterCriteria.categories.length === 0 ||
                filterCriteria.categories.every(category =>
                    product.categories.some(productCategory =>
                        productCategory.toLowerCase() === category.toLowerCase()
                    )
                );

            return matchesMinPrice && matchesMaxPrice && matchesRating && matchesCategories;
        });
        
        setFilteredProducts(filtered);
    }, [productGrids,filterCriteria]);

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

    const handleRenderItem = ({item}: { item: productGrid }) => (
        <FlatListItem item={item} path= "shop" itemWidth={itemWidth} />
    );

    const handleBack = () => {
        resetFilter();
        //manual change as react references to the old value
        applyFilters({
            minPrice: null,
            maxPrice: null,
            minRating: null,
            categories: []
        })
        router.push("/(tabs)/profile");
    };

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

    const removeImage = () => {
        setImageUri(null);
    }

    const saveImage = (image: string) => {
        setImageUri(image);
        setIsEditingShopAvatar(false);
    };

    const resetFilter = () => {
        setCurrFilterCriteria({
            minPrice: null,
            maxPrice: null,
            minRating: null,
            categories: [],
        })
    }

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
    const applyFilters = (newFilters: filterCriteriaType) => {
        if (newFilters.minPrice && newFilters.maxPrice && newFilters.minPrice > newFilters.maxPrice) {
            setFilterError(true);
        } else {
            setFilterError(false);
            setFilterCriteria(newFilters);
            setModalVisible(false);
        }
    };

    const handleCategoryToggle = (category: string) => {
        const index = currFilterCriteria.categories.indexOf(category);
        if (index === -1) {
            setCurrFilterCriteria({
                ...currFilterCriteria,
                categories: [...currFilterCriteria.categories, category]
            })
        } else {
            const newCategories = currFilterCriteria.categories;
            newCategories.splice(index, 1);
            setCurrFilterCriteria({
                ...currFilterCriteria,
                categories: newCategories,
            })
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <View>
                <BackArrow handleBack={handleBack} />
                <ProfilePicture imageUri={imageUri} imageWidth={imageWidth} name={shopName}/>
                <View className="width-full flex-row justify-center">
                    <View className="flex-row w-[90%] justify-between">
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>setShowShopDescription(true)}>
                            <View>
                                <CustomText style={{color: "#3b82f6"}}
                                text="More Info" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setModalVisible(true)} className="pb-4">
                            <CustomText
                            text="Filter" />
                        </TouchableOpacity>
                    </View>
                </View>
                {isMyShop(shop.userId, userData.id) && 
                    <EditShopButton setter={setIsEditingShop}/>
                }
            </View>
            <ProductFilter 
            modalVisible={modalVisible} 
            currFilterCriteria={currFilterCriteria}
            setCurrFilterCriteria={setCurrFilterCriteria}
            filterError={filterError}
            handleCategoryToggle={handleCategoryToggle}
            resetFilter={resetFilter}
            setModalVisible={setModalVisible}
            applyFilters={applyFilters}
            />
            <View className="items-center">
                <FlatList
                key={width}
                data={filteredProducts}
                keyExtractor={(item: productGrid) => item.productId}
                renderItem={handleRenderItem}
                numColumns={itemsPerRow}
                columnWrapperStyle={itemsPerRow > 1 && { justifyContent: "flex-start" }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={true}
                />
            </View>
            {isMyShop(shop.userId, userData.id) && 
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
                                    <CustomText 
                                    style={{color: "#3b82f6",fontSize: 18}}
                                    text="Save"/>
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
                                    <CustomText style={{color: "white"}}
                                    text="Delete my shop"
                                    isBold={true}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <EditProfilePictureModal haveRemove={true} visible={isEditingShopAvatar} onClose={()=>setIsEditingShopAvatar(false)} onUpload={(mode: string)=>uploadImage(mode, saveImage)} onRemove={removeImage}/>
            </Modal>
            <CreateProductModal visible={isCreatingProduct} onClose={()=>setIsCreatingProduct(false)} onSubmit={(product: any)=>{}}/>
        </SafeAreaView>
    );
}