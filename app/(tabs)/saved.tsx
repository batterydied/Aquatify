import { View, Text, FlatList, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { cartItem } from "@/lib/interface";
import { useCallback, useState } from "react";
import { useUserData } from '@/contexts/UserContext';
import { Redirect, router, useFocusEffect } from "expo-router";
import { deleteItemFromCart, getAllSavedItemsByUserId, sortImageById, moveItem, getProductType } from "@/lib/utils";

export default function SavedPage(){
    const [ savedItems, setSavedItems ] = useState<cartItem[]>([]);
    const { userData } = useUserData();
    const { width } = useWindowDimensions();

    if (!userData) {
        return <Redirect href="/sign-in" />;
    }

    const fetchData = async () => {
        try {
          const data = await getAllSavedItemsByUserId(userData.id);
          setSavedItems(data || []);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
    };

    // Refresh cart when the screen is focused
    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );

    const goToProductPage = (productId: string) => {
        router.push(`/(tabs)/(product)/${productId}`);
    };

    const handleDeletingItem = async (cartId: string) => {
          await deleteItemFromCart(cartId);
          await fetchData();
    };
    
    const handleMoveItem = async (cartId: string) => {
        await moveItem(cartId);
        await fetchData();
      }

    const renderItem = ({item}:{item: cartItem})=>{
      const productType = getProductType(item.productTypeId, item.Product.productTypes);
      return (
        <TouchableOpacity 
        onPress={()=>goToProductPage(item.Product.productId)}
        activeOpacity={0.7}
        >
          <View className="w-full bg-c3 rounded-lg my-2">
            <View className="p-4">
              <Text
              className="mb-2"
              style={{
                fontSize: width * 0.025,
                fontFamily: "MontserratRegular",
              }}
              >
                {item.Product.sellerName}
              </Text>
              <View className="flex-row mb-2">
                <Image
                  source={{ uri: sortImageById(item.Product.images)[0].url }}
                  className="rounded-md mr-2"
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: width * 0.025,
                      fontFamily: "MontserratRegular",
                    }}
                  >
                    {item.Product.name}
                  </Text>
                  <Text
                    className="text-gray-800"
                    style={{
                      fontSize: width * 0.025,
                      fontFamily: "MontserratRegular",
                    }}
                  >
                    {item.Product.secondaryName}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.025,
                      fontFamily: "MontserratRegular",
                    }}
                  >
                    {`(${productType?.type})`}
                  </Text>
                  <Text
                    className="text-green-800"
                    style={{
                      fontSize: width * 0.04,
                      fontFamily: "MontserratBold",
                    }}
                  >
                    {`$${productType?.price}`}
                  </Text>
                </View>
              </View>
              <View className="flex-row">
                <TouchableOpacity onPress={() => handleDeletingItem(item.id)}>
                    <Text
                    style={{
                      fontSize: width * 0.025,
                      fontFamily: "MontserratRegular",
                    }}
                    >
                      Remove
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress= {() => handleMoveItem(item.id)} className="ml-4">
                  <Text
                  style={{
                    fontSize: width * 0.025,
                    fontFamily: "MontserratRegular",
                  }}
                  >
                    Move back to cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    return (
        <View className="flex-1 p-5 items-center bg-gray-200">
          {savedItems.length > 0 ?
          <View className="mt-16 w-full">
            <FlatList
            bounces={false}
            data={savedItems}
            keyExtractor={(item: cartItem) => item.id}
            renderItem={renderItem}
            />
          </View>
          :
          <View className="flex-1 justify-center">
            <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>
              You have no saved items!
            </Text>
          </View>
          }
        </View>
      );      
}