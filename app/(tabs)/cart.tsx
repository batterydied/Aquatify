import { View, Text, TouchableOpacity, Image, FlatList, useWindowDimensions } from "react-native";
import { useState, useCallback } from "react";
import { fetchAllCartItems } from "@/lib/utils";
import { useFocusEffect } from "@react-navigation/native";
import { cartItem } from "@/lib/interface";
import { getProductType, calculatePriceWithQuantity } from "@/lib/utils";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const { width } = useWindowDimensions();
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
  
  const renderItem = ({item}: {item: cartItem})=>{
    return (
      <View className="w-full bg-c2 rounded-lg">
        <View className="p-2">
          <Text 
          className="mb-2"
          style={
            {
              fontSize: width * .025,
              fontFamily: "MontserratRegular",
            }
          }
          >{item.Product.sellerName}</Text>
          <View className="flex-row mb-2">
            <Image 
            source={{uri: item.Product.images[0].url}} 
            className="rounded-md mr-2"
            style={
              {
                width: width * .2,
                height: width* .2,
              }
            }
            ></Image>
            <View>
              <Text
              style={
                {
                  fontSize: width * .025,
                  fontFamily: "MontserratRegular",
                }
              }
              >{item.Product.name}</Text>
              <Text 
              className="text-gray-800"
              style={
                {
                  fontSize: width * .025,
                  fontFamily: "MontserratRegular",
                }
              }
              >{item.Product.secondaryName}</Text>
              {getProductType(item.productTypeId, item.Product.productTypes) ? (
              <View>
                <Text
                style={
                  {
                    fontSize: width * .025,
                    fontFamily: "MontserratRegular",
                  }
                }
                >
                  {`(${getProductType(item.productTypeId, item.Product.productTypes)?.type})`}
                </Text>
                <Text>{'quantity: ' + item.quantity}</Text>
                <Text 
                className="text-green-600"
                style={
                  {
                    fontSize: width * .04,
                    fontFamily: "MontserratRegular",
                  }
                }
                >{'$' + calculatePriceWithQuantity(item.quantity, getProductType(item.productTypeId, item.Product.productTypes)!.price) }</Text>
              </View>
              ) : 
              <Text>
                Item unavailable, please remove from cart.
              </Text>}
            </View>
          </View>

          <Text>Placeholder</Text>

        </View>
      </View>
    )
  }
  

  return (
    <View className="flex-1 p-5 items-center bg-c3">
      {cartItems.length > 0 ? (
        <View className="mt-16 w-full">
          <FlatList 
          data={cartItems}
          keyExtractor={(item: cartItem) => item.id}
          renderItem={renderItem}
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
