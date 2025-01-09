import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useState, useCallback } from "react";
import { fetchAllCartItems } from "@/lib/utils";
import { useFocusEffect } from "@react-navigation/native";
import { fetchProductById } from "@/lib/utils";
import { productInterface, cartItem } from "@/lib/interface";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);

  const fetchData = async () => {
    try {
      const data = await fetchAllCartItems();
      setCartItems(data || []);
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

const renderCartItem = async ({ item }: { item: cartItem }) => {
  try {
    const data = await fetchProductById(item.productId);
    console.log(data.name);
    return (
      <View>
        <Text>{data.name}</Text>
      </View>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  return <View><Text>hi</Text></View>;
};
  
  

  return (
    <View className="flex-1 p-5 items-center bg-c3">
      {cartItems.length > 0 ? (
        <View className="mt-16">
          <FlatList 
          data={cartItems}
          keyExtractor={(item: cartItem) => item.id}
          renderItem={renderCartItem}
          />
        </View>):
        <View className="mt-16 flex-1 justify-center items-center">
          <Image className="w-[300px] h-[300px]" source={require('../../assets/images/basket.png')} />
          <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>Your cart is empty!</Text>
        </View>
      }

    </View>
  );
}
