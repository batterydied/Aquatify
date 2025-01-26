import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
    ActivityIndicator,
  } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { cartItem } from "@/lib/interface";
import { calculatePriceWithQuantity, getProductType } from "@/lib/apiCalls";
  
  export default function OrderConfirmationPage() {
    const params = useLocalSearchParams();
  
    // Safely parse cartItems
    const cartItems: cartItem[] = typeof params.cartItems === "string" ? JSON.parse(params.cartItems) : [];
  
    // Safely parse subtotal, tax, and total
    const subtotal: number = typeof params.subtotal === "string" ? parseFloat(params.subtotal) : 0;
    const tax: number = typeof params.tax === "string" ? parseFloat(params.tax) : 0;
    const total: number = typeof params.total === "string" ? parseFloat(params.total) : 0;
  
    const { width } = useWindowDimensions();
    const [fontsLoaded] = useFonts({
      MontserratRegular: Montserrat_400Regular,
      MontserratBold: Montserrat_700Bold,
    });
  
    if (!fontsLoaded) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
  
    const renderCartItem = (item: cartItem) => {
      const productType = getProductType(item.productTypeId, item.Product.productTypes);
      const price = productType ? calculatePriceWithQuantity(item.quantity, productType.price) : 0;
  
      return (
        <View key={item.id} className="flex-row justify-between items-center p-4 border-b border-gray-300">
          <View>
            <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
              {item.Product.name}
            </Text>
            {productType && <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.03, color: "gray" }}>
              {productType.type}
            </Text>}
            <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.03, color: "gray" }}>
              {`${item.quantity} x $${productType?.price.toFixed(2)}`}
            </Text>
          </View>
          <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.035 }}>
            {`$${price.toFixed(2)}`}
          </Text>
        </View>
      );
    };
  
    return (
      <SafeAreaView className="flex-1 p-5 bg-gray-200">
        <ScrollView showsVerticalScrollIndicator={false} className="p-5">
          <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.06, marginBottom: 20 }}>
            Order Confirmation
          </Text>
  
          {/* Order Summary */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
              Thank you for your order!
            </Text>
            <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035, marginBottom: 20 }}>
              Your order has been successfully placed. Below are the details of your order.
            </Text>
  
            <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
              Order Summary
            </Text>
            {cartItems.map((item) => renderCartItem(item))}
            <View className="flex-row justify-between mt-4">
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>Subtotal:</Text>
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>
                {`$${subtotal.toFixed(2)}`}
              </Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>Tax:</Text>
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>
                {`$${tax.toFixed(2)}`}
              </Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>Total:</Text>
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>
                {`$${total.toFixed(2)}`}
              </Text>
            </View>
          </View>
  
          {/* Continue Shopping Button */}
          <TouchableOpacity
            className="bg-orange-400 p-4 rounded-full items-center"
            onPress={() => router.push("/home")}
          >
            <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, color: "white" }}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }