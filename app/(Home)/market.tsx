import { View, Text } from "react-native";
import { homeProduct, fetchProducts } from "@/lib/user";
import { useState } from "react";

export default function Market(){
    const [homeProducts, setHomeProducts] = useState<homeProduct[]>([]);
    return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Hello from Market</Text>
        </View>
      );      
}