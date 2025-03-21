import {
    View,
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
import CustomText from "@/components/CustomText";
  
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
            <CustomText text={item.Product.name} style={{fontSize: width * 0.035}} />
            {productType && <CustomText text={productType.type} style={{fontSize: width * 0.03, color: "gray"}} /> }
            <CustomText text={`${item.quantity} x $${productType?.price.toFixed(2)}`} style={{fontSize: width * 0.03, color: "gray"}} />
          </View>
          <CustomText text={`$${price.toFixed(2)}`} style={{fontSize: width * 0.035}} isBold={true} />
        </View>
      );
    };
  
    return (
      <SafeAreaView className="flex-1 p-5 bg-gray-200">
        <ScrollView showsVerticalScrollIndicator={false} className="p-5">
          <CustomText text="Order Confirmation" style={{fontSize: width * 0.06, marginBottom: 20}} isBold={true} />
  
          {/* Order Summary */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <CustomText text="Thank you for your order!" style={{fontSize: width * 0.04, marginBottom: 10}} isBold={true} />
            <CustomText text="Your order has been successfully placed. Below are the details of your order." style={{fontSize: width * 0.035, marginBottom: 20}} />
  
            <CustomText text="Order Summary" style={{fontSize: width * 0.04, marginBottom: 10}} isBold={true} />
            {cartItems.map((item) => renderCartItem(item))}
            <View className="flex-row justify-between mt-4">
              <CustomText text="Subtotal:" style={{fontSize: width * 0.04}} isBold={true} />
              <CustomText text={`$${subtotal.toFixed(2)}`} style={{fontSize: width * 0.04 }} isBold={true} />
            </View>
            <View className="flex-row justify-between mt-2">
              <CustomText text="Tax:" style={{fontSize: width * 0.04}} isBold={true} />
              <CustomText text={`$${tax.toFixed(2)}`} style={{fontSize: width * 0.04}} isBold={true} />

            </View>
            <View className="flex-row justify-between mt-2">
              <CustomText text="Total:" style={{fontSize: width * 0.04}} isBold={true} />
              <CustomText text={`$${total.toFixed(2)}`} style={{fontSize: width * 0.04}} isBold={true} />
            </View>
          </View>
  
          {/* Continue Shopping Button */}
          <TouchableOpacity
            className="bg-orange-400 p-4 rounded-full items-center"
            onPress={() => router.push("/home")}
          >
            <CustomText text="Continue Shopping" style={{fontSize: width * 0.04, color: "white"}} isBold={true} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }