import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from "react-native";
  import { useState } from "react";
  import { useUserData } from "@/contexts/UserContext";
  import { calculatePriceWithQuantity, getProductType } from "@/lib/apiCalls";
  import { cartItem } from "@/lib/interface";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
  import { router, useLocalSearchParams } from "expo-router";
  
  export default function CheckoutPage() {
    const params = useLocalSearchParams();
  
    // Safely parse cartItems
    const cartItems: cartItem[] = typeof params.cartItems === "string" ? JSON.parse(params.cartItems) : [];
  
    // Safely parse subtotal
    const subtotal: number = typeof params.subtotal === "string" ? parseFloat(params.subtotal) : 0;
  
    // Tax rate (e.g., 10%)
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate; // Calculate tax
    const total = subtotal + tax; // Calculate total
  
    // Shipping Information State
    const [shippingInfo, setShippingInfo] = useState({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    });
  
    // Payment Information State
    const [paymentInfo, setPaymentInfo] = useState({
      cardNumber: "",
      cardHolderName: "",
      expirationDate: "",
      cvv: "",
    });
  
    const [loading, setLoading] = useState<boolean>(false);
    const { userData } = useUserData();
    const { width } = useWindowDimensions();
  
    const [fontsLoaded] = useFonts({
      MontserratRegular: Montserrat_400Regular,
      MontserratBold: Montserrat_700Bold,
    });
  
    if (!userData) {
      router.push("/(auth)/sign-in");
      return null;
    }
  
    const handlePlaceOrder = async () => {
      // Validate Shipping Information
      if (
        !shippingInfo.fullName ||
        !shippingInfo.addressLine1 ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.postalCode ||
        !shippingInfo.country ||
        !shippingInfo.phoneNumber
      ) {
        alert("Please fill out all shipping information fields.");
        return;
      }
  
      // Validate Payment Information
      if (
        !paymentInfo.cardNumber ||
        !paymentInfo.cardHolderName ||
        !paymentInfo.expirationDate ||
        !paymentInfo.cvv
      ) {
        alert("Please fill out all payment information fields.");
        return;
      }
  
      setLoading(true);
      try {
        // Simulate placing an order (replace with your API call)
        setTimeout(() => {
          setLoading(false);
          alert("Order placed successfully!");
          router.push("/orders"); // Redirect to orders page
        }, 2000);
      } catch (error) {
        console.error("Error placing order:", error);
        setLoading(false);
      }
    };
  
    const renderCartItem = (item: cartItem) => {
      const productType = getProductType(item.productTypeId, item.Product.productTypes);
      const price = productType ? calculatePriceWithQuantity(item.quantity, productType.price) : 0;
  
      return (
        <View key={item.id} className="flex-row justify-between items-center p-4 border-b border-gray-300">
          <View>
            <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
              {item.Product.name}
            </Text>
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
  
    if (!fontsLoaded) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView className="flex-1 p-5 bg-gray-200">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.06, marginBottom: 20 }}>
                Checkout
              </Text>
  
              {/* Order Summary */}
              <View className="bg-white rounded-lg p-4 mb-4">
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
  
              {/* Shipping Information */}
              <View className="bg-white rounded-lg p-4 mb-4">
                <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
                  Shipping Information
                </Text>
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="gray"
                  value={shippingInfo.fullName}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, fullName: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Address Line 1"
                  placeholderTextColor="gray"
                  value={shippingInfo.addressLine1}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, addressLine1: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Address Line 2 (Optional)"
                  placeholderTextColor="gray"
                  value={shippingInfo.addressLine2}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, addressLine2: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="City"
                  placeholderTextColor="gray"
                  value={shippingInfo.city}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, city: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="State"
                  placeholderTextColor="gray"
                  value={shippingInfo.state}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, state: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Postal Code"
                  placeholderTextColor="gray"
                  value={shippingInfo.postalCode}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, postalCode: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Country"
                  placeholderTextColor="gray"
                  value={shippingInfo.country}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, country: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor="gray"
                  value={shippingInfo.phoneNumber}
                  onChangeText={(text) => setShippingInfo({ ...shippingInfo, phoneNumber: text })}
                  className="p-3 border border-gray-300 rounded-lg"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                  keyboardType="phone-pad"
                />
              </View>
  
              {/* Payment Information */}
              <View className="bg-white rounded-lg p-4 mb-4">
                <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
                  Payment Information
                </Text>
                <TextInput
                  placeholder="Card Number"
                  placeholderTextColor="gray"
                  value={paymentInfo.cardNumber}
                  onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Cardholder Name"
                  placeholderTextColor="gray"
                  value={paymentInfo.cardHolderName}
                  onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardHolderName: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="Expiration Date (MM/YY)"
                  placeholderTextColor="gray"
                  value={paymentInfo.expirationDate}
                  onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expirationDate: text })}
                  className="p-3 border border-gray-300 rounded-lg mb-3"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                  placeholder="CVV"
                  placeholderTextColor="gray"
                  value={paymentInfo.cvv}
                  onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
                  className="p-3 border border-gray-300 rounded-lg"
                  style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
  
              {/* Place Order Button */}
              <TouchableOpacity
                className="bg-orange-400 p-4 rounded-full items-center"
                onPress={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, color: "white" }}>
                    Place Order
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }