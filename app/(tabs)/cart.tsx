import { View, Text, TouchableOpacity, Image, FlatList, useWindowDimensions } from "react-native";
import { useState, useCallback } from "react";
import { updateCartQuantity, fetchAllCartItemsByUser } from "@/lib/utils";
import { useFocusEffect } from "@react-navigation/native";
import { cartItem } from "@/lib/interface";
import { getProductType, calculatePriceWithQuantity, deleteItemFromCart } from "@/lib/utils";
import QuantityDropdownComponent from "@/components/QuantityDropdown";
import { useUserData } from '@/contexts/UserContext';
import { Redirect } from 'expo-router'; 

export default function CartPage() {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const { userData } = useUserData();
  const { width } = useWindowDimensions();

  if (!userData) {
    return <Redirect href="/sign-in" />;
  }

  const fetchData = async () => {
    try {
      const data = await fetchAllCartItemsByUser(userData.id);
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
    const productType = getProductType(item.productTypeId, item.Product.productTypes)
    const handleQuantityUpdate = async (quantity: string)=>{
      await updateCartQuantity(parseFloat(quantity), item.id);
      await fetchData();
    }
    const handleDeletingItem = async (cartId: string)=>{
      await deleteItemFromCart(cartId);
      await fetchData();
    }
    return (
      <View className="w-full bg-c3 rounded-lg my-2">
        <View className="p-4">
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
              {productType ? (
              <View>
                <Text
                style={
                  {
                    fontSize: width * .025,
                    fontFamily: "MontserratRegular",
                  }
                }
                >
                  {`(${productType.type})`}
                </Text>
                <Text 
                className="text-green-800"
                style={
                  {
                    fontSize: width * .04,
                    fontFamily: "MontserratBold",
                  }
                }
                >{'$' + calculatePriceWithQuantity(item.quantity, productType.price) }</Text>
              </View>
              ) : 
              <Text
              style={
                {
                  fontSize: width * .025,
                  fontFamily: "MontserratRegular",
                }
              }>
                Item unavailable, please remove from cart.
              </Text>}
            </View>
          </View>
          <View className="flex-row items-center">
            {productType && (
              <View className="w-[30%] mr-4">
                <QuantityDropdownComponent maxQuantity={productType.quantity} currentQuantity={item.quantity.toString()} select={handleQuantityUpdate}/>
              </View>
              )}
  
              <TouchableOpacity
              onPress= {()=>handleDeletingItem(item.id)}
              >
                <Text
                style={
                  {
                    fontSize: width * .025,
                    fontFamily: "MontserratRegular",
                  }
                }>
                  Remove
                </Text>
              </TouchableOpacity>
              {productType && (
              <TouchableOpacity className="ml-4">
                <Text style={
                {
                  fontSize: width * .025,
                  fontFamily: "MontserratRegular",
                }
                }>
                  Save for later
                </Text>
              </TouchableOpacity>)}
            </View>
          </View>
      </View>
    )
  }
  

  return (
    <View className="flex-1 p-5 items-center bg-gray-200">
      {cartItems.length > 0 ? (
        <View className="mt-16 w-full">
          <FlatList 
          bounces={false}
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
