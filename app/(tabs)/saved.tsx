import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { cartItem } from "@/lib/interface";
import { useCallback, useState } from "react";
import { useUserData } from '@/contexts/UserContext';
import { Redirect, router, useFocusEffect } from "expo-router";
import { getAllSavedItemsByUserId } from "@/lib/utils";

export default function SavedPage(){
    const [ savedItems, setSavedItems ] = useState<cartItem[]>([]);
    const { userData } = useUserData();

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

    const renderItem = ({item}:{item: cartItem})=>{
      return (
        <TouchableOpacity 
              onPress={()=>goToProductPage(item.Product.productId)}
              activeOpacity={0.7}
              >
                <View className="w-full bg-c3 rounded-lg my-2">
                  <View className="p-4">
                    <Text>
                      {item.Product.name}
                    </Text>
                  </View>
                </View>
        </TouchableOpacity>
      )
    }

    return (
        <View className="flex-1 p-5 items-center bg-gray-200">
          <View className="mt-16">
            <FlatList
            bounces={false}
            data={savedItems}
            keyExtractor={(item: cartItem) => item.id}
            renderItem={renderItem}
            />
          </View>
        </View>
      );      
}