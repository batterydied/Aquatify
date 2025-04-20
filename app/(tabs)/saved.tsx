import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { cartItem } from "@/lib/interface";
import { useCallback, useState } from "react";
import { useUserData } from "@/contexts/UserContext";
import { Redirect, useFocusEffect } from "expo-router";
import {
  deleteItemFromCart,
  getAllSavedItemsByUserId,
  sortImageById,
  moveItem,
  getProductType,
} from "@/lib/apiCalls";
import { SafeAreaView } from "react-native-safe-area-context";
import { goToProductPage } from "@/lib/goToProductPage";
import CustomText from "@/components/CustomText";

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<cartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {userData} = useUserData();
  const {width} = useWindowDimensions();

  if (!userData) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getAllSavedItemsByUserId(userData.id);
      setSavedItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Refresh cart when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDeletingItem = async (cartId: string) => {
    await deleteItemFromCart(cartId);
    await fetchData();
  };

  const handleMoveItem = async (cartId: string) => {
    await moveItem(cartId);
    await fetchData();
  };

  const renderItem = ({ item }: { item: cartItem }) => {
    const productType = getProductType(item.productTypeId, item.Product.productTypes);
    return (
      <TouchableOpacity
        onPress={() => goToProductPage(item.Product.productId, "saved")}
        activeOpacity={0.7}
      >
        <View className="w-full bg-c3 rounded-lg my-2">
          <View className="p-4">
            <CustomText text={item.Product.shop.shopName} style={{fontSize: width * 0.025, marginBottom: 8}}/>
            <View className="flex-row mb-2">
              <Image
                source={item.Product.images && item.Product.images[0]? { uri: sortImageById(item.Product.images)[0].url } : require('../../assets/images/no-image-icon.png')}
                className="rounded-md mr-2"
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                }}
              />
              <View>
                <CustomText text={item.Product.name} style={{fontSize: width * 0.025}} isBold={true}/>
                <CustomText 
                  text={item.Product.secondaryName} 
                  style={{ 
                    fontSize: width * 0.025, 
                    color: "#1f2937"
                  }} 
                />
                <CustomText style={{fontSize: width * 0.025}} text={`(${productType?.type})`} />
                <CustomText style={{fontSize: width * 0.04, color: "#065f46"}} text={`$${productType?.price}`} isBold={true} />
              </View>
            </View>
            <View className="flex-row">
              <TouchableOpacity onPress={() => handleDeletingItem(item.id)}>
                <CustomText style={{fontSize: width * 0.035, color: "#7f1d1d"}} text="Remove" isBold={true}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMoveItem(item.id)} className="ml-4">
                <CustomText style={{fontSize: width * 0.035}} text="Move back to cart"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 p-5 items-center bg-gray-200">
      {loading ? ( // Show loading indicator while data is being fetched
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : savedItems.length > 0 ? ( // Show saved items if data is loaded
        <View className="w-full">
          <FlatList
            bounces={false}
            data={savedItems}
            keyExtractor={(item: cartItem) => item.id}
            renderItem={renderItem}
          />
        </View>
      ) : ( // Show empty state if no saved items
        <View className="flex-1 justify-center">
          <Image
            className="absolute -bottom-20 left-0"
            source={require("../../assets/images/black-cat.png")}
            style={{
              width: width * 0.5,
              height: width * 0.5,
            }}
          />
          <CustomText style={{fontSize: 30}} text="You have no saved items!"/>
        </View>
      )}
    </SafeAreaView>
  );
}