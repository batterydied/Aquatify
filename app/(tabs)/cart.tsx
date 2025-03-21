import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  useWindowDimensions, 
  ActivityIndicator, 
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { updateCartQuantity, getAllCartItemsByUser } from "@/lib/apiCalls";
import { useFocusEffect } from "@react-navigation/native";
import { cartItem } from "@/lib/interface";
import { getProductType, calculatePriceWithQuantity, deleteItemFromCart, deleteAllItemFromCart, sortImageById, saveItem } from "@/lib/apiCalls";
import QuantityDropdownComponent from "@/components/QuantityDropdown";
import { useUserData } from "@/contexts/UserContext";
import { Redirect, router } from "expo-router"; 
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const {userData} = useUserData();
  const {width} = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(true);

  if (!userData) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getAllCartItemsByUser(userData.id);
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const goToProductPage = (productId: string) => {
    router.push({
      pathname: "/(tabs)/product" as any,
      params: {
         productId,
         fromPage: "/(tabs)/cart"
      }
  });
  };

  // Refresh cart when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Recalculate the subtotal whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const productType = getProductType(item.productTypeId, item.Product.productTypes);
      const availableQuantity = Math.min(productType?.quantity || 0, item.quantity);
      
      // Update cart quantity if the selected quantity exceeds availability
      if (availableQuantity < item.quantity) {
        updateCartQuantity(availableQuantity, item.id);
      }
  
      const price = calculatePriceWithQuantity(availableQuantity, productType?.price || 0);
      return sum + price;
    }, 0);
  
    setSubtotal(total);
  }, [cartItems]);  

  const handleDeleteAllItemFromCart = async () => {
    await deleteAllItemFromCart(userData.id);
    await fetchData();
  };

  const handleSaveItem = async (cartId: string) => {
    await saveItem(cartId);
    await fetchData();
  }

  const renderItem = ({ item }: { item: cartItem }) => {
    const productType = getProductType(item.productTypeId, item.Product.productTypes);
    const handleQuantityUpdate = async (quantity: string) => {
      await updateCartQuantity(parseFloat(quantity), item.id);
      await fetchData();
    };
    const handleDeletingItem = async (cartId: string) => {
      await deleteItemFromCart(cartId);
      await fetchData();
    };

    const price = (productType && productType.quantity != 0) ? calculatePriceWithQuantity(item.quantity, productType.price || 0) : 0;

    return (
      <TouchableOpacity 
      onPress={()=>goToProductPage(item.Product.productId)}
      activeOpacity={0.7}
      >
        <View className="w-full bg-c3 rounded-lg my-2 flex justify-center">
          <View className="p-4">
            <Text
              className="mb-2"
              style={{
                fontSize: width * 0.025,
                fontFamily: "MontserratRegular",
              }}
            >
              {item.Product.shop.shopName}
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
                    fontFamily: "MontserratBold",
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
                {productType && productType.quantity != 0 && (
                  <View>
                    <Text
                      style={{
                        fontSize: width * 0.025,
                        fontFamily: "MontserratRegular",
                      }}
                    >
                      {`(${productType.type})`}
                    </Text>
                    <Text
                      className="text-green-800"
                      style={{
                        fontSize: width * 0.04,
                        fontFamily: "MontserratBold",
                      }}
                    >
                      {`$${price.toFixed(2)}`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {productType && productType.quantity > 0 ? (
              <View className="flex-row items-center">
              {productType && (
                <View className="w-[30%] mr-4">
                  <QuantityDropdownComponent
                    maxQuantity={productType.quantity}
                    currentQuantity={productType.quantity > item.quantity ? item.quantity.toString() : productType.quantity.toString()}
                    select={handleQuantityUpdate}
                  />
                </View>
              )}

              <TouchableOpacity onPress={() => handleDeletingItem(item.id)}>
                <Text
                  style={{
                    fontSize: width * 0.035,
                    color: "#7f1d1d",
                    fontFamily: "MontserratBold",
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
              {productType && (
                <TouchableOpacity onPress= {() => handleSaveItem(item.id)} className="ml-4">
                  <Text
                    style={{
                      fontSize: width * 0.035,
                      fontFamily: "MontserratRegular",
                    }}
                  >
                    Save for later
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            ):(
            <TouchableOpacity onPress={() => handleDeletingItem(item.id)}>
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: "#7f1d1d",
                  fontFamily: "MontserratBold",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>)
            }
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
      ):(cartItems.length > 0 ? (
        <View className="w-full">
          <View className="mb-2">
            <Text
              style={{
                fontSize: width * 0.04,
                fontFamily: "MontserratRegular",
              }}
            >
              {"Subtotal: $" + subtotal.toFixed(2)}
            </Text>
            <View className="w-full flex items-center">
              <CustomButton title="Proceed to checkout" color="black" size={width * 0.035} 
              onPress={
                () => router.push({
                  pathname: "/(tabs)/checkout",
                  params: {
                    cartItems: JSON.stringify(cartItems),
                    subtotal: subtotal.toFixed(2),
                  },
                })
              }
              style={{
                backgroundColor: "#fb923c",
                borderRadius: 32,
                width: 380,
                margin: 8,
                padding: 12
              }}/>
              <CustomButton title="Empty cart" 
              color="white"
              onPress={handleDeleteAllItemFromCart}
              style={{
                backgroundColor: "#b91c1c",
                borderRadius: 32,
                width: 380,
                padding: 12
              }}/>
            </View>
          </View>
          <FlatList
            bounces={false}
            data={cartItems}
            keyExtractor={(item: cartItem) => item.id}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View className="mt-16 flex-1 justify-center items-center">
          <Image
            source={require("../../assets/images/basket.png")}
            style={{
              width: width * .6,
              height: width * .6
            }}
          />
          <Text className="text-3xl" style={{ fontFamily: "MontserratRegular" }}>
            Your cart is empty!
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
}
