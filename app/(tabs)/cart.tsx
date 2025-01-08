import { View, Text, TouchableOpacity, Image } from "react-native";
import { cartItem } from "@/lib/cartPageInterface";
import { useState, useCallback } from "react";
import { fetchAllCartItems } from "@/lib/utils";
import { useFocusEffect } from "@react-navigation/native";

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

  return (
    <View className="flex-1 p-5 items-center bg-c3">
      {cartItems.length > 0 ? (
        <View className="mt-16">
        {cartItems.map((item) => (
            <Text key={item.id} className="mt-2">${item.id}</Text>
          ))}
        </View>):
        <View className="mt-16 flex-1 justify-center items-center">
          <Image className="w-[300px] h-[300px]" source={require('../../assets/images/basket.png')} />
          <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>Your cart is empty!</Text>
        </View>
      }

    </View>
  );
}
