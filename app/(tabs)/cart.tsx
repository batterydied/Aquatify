import { View, Text, TouchableOpacity } from "react-native";
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
    <View className="flex-1 p-5 items-center">
      <View className="mt-16">
        <TouchableOpacity onPress={fetchData}>
          <Text className="text-blue-500 underline">Refresh Cart</Text>
        </TouchableOpacity>
        <Text className="text-red-500 mt-4">Hello from Cart</Text>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Text key={item.id} className="mt-2">${item.id}</Text>
          ))
        ) : (
          <Text className="mt-4">No items in the cart</Text>
        )}
      </View>
    </View>
  );
}
