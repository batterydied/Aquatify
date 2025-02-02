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
import { useCallback, useState } from "react";
import { useUserData } from "@/contexts/UserContext";
import { calculatePriceWithQuantity, getProductType, fetchAddresses, fetchPaymentMethods, placeOrder, deleteAllItemFromCart } from "@/lib/apiCalls";
import { cartItem, address, paymentMethod } from "@/lib/interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import AddressDropdown from "@/components/AddressDropdown";
import PaymentMethodsDropdown from "@/components/PaymentMethodDropdown";
  
export default function CheckoutPage() {
    const params = useLocalSearchParams();

    // Safely parse cartItems
    const cartItems: cartItem[] = typeof params.cartItems === "string" ? JSON.parse(params.cartItems) : [];

    // Safely parse subtotal
    const subtotal: number = typeof params.subtotal === "string" ? parseFloat(params.subtotal) : 0;

    // Tax rate (e.g., 10%)
    const taxRate = 0.1; // 10% tax
    const tax = parseFloat((subtotal * taxRate).toFixed(2)); // Calculate tax
    const total = subtotal + tax; // Calculate total

    // Shipping Information State
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        streetAddress: "",
        streetAddress2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
    });

    // Payment Information State
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        cardName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const {userData} = useUserData();
    const {width} = useWindowDimensions();
    const [addresses, setAddresses] = useState<address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<address | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<paymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<paymentMethod | null>(null);

    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });

    if (!userData) {
        router.push("/(auth)/sign-in");
        return null;
    }

    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
        const addressData = await fetchAddresses(userData.id);
        const paymentData = await fetchPaymentMethods(userData.id);
        setAddresses(addressData || []);
        setPaymentMethods(paymentData || []);
        } catch (error) {
        console.error("Error fetching addresses:", error);
        } finally {
        setLoading(false); // Stop loading
        }
    };

    useFocusEffect(
        useCallback(() => {
        fetchData();
        }, [fetchData])
    );

    const handlePlaceOrder = async () => {
        // Validate Shipping Information
        if (
            !shippingInfo.fullName ||
            !shippingInfo.streetAddress ||
            !shippingInfo.city ||
            !shippingInfo.state ||
            !shippingInfo.zipCode ||
            !shippingInfo.phoneNumber
        ) {
            alert("Please fill out all shipping information fields.");
            return;
        }

        // Validate Payment Information
        if (
            !paymentInfo.cardNumber ||
            !paymentInfo.cardName ||
            !paymentInfo.expiryMonth ||
            !paymentInfo.expiryYear ||
            !paymentInfo.cvv
        ) {
            alert("Please fill out all payment information fields.");
            return;
        }

        setLoading(true);
        try {
            // Simulate placing an order (replace with your API call)
            await deleteAllItemFromCart(userData.id);
            await placeOrder(userData.id, shippingInfo, cartItems, {subtotal, tax, total});

            router.push({
                pathname: "/(tabs)/order",
                params: {
                    cartItems: JSON.stringify(cartItems), // Serialize cartItems to a string
                    subtotal: subtotal.toString(), // Convert subtotal to a string
                    tax: tax.toString(), // Convert tax to a string
                    total: total.toString(), // Convert total to a string
                }
            });
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order.");
            setLoading(false);
        }
    };

    const handlePaymentMethodSelect = (paymentMethod: paymentMethod | null) => {
        if (paymentMethod) {
        setSelectedPaymentMethod(paymentMethod);
        setPaymentInfo({
            ...paymentInfo,
            cardName: paymentMethod.cardName || "",
            cardNumber: paymentMethod.cardNumber || "",
            expiryMonth: paymentMethod.expiryMonth || "",
            expiryYear: paymentMethod.expiryYear || "",
            cvv: paymentMethod.cvv || "",
        });
        } else {
        // Reset the form if "Select a payment method" is chosen
        setSelectedPaymentMethod(null);
        setPaymentInfo({
            ...paymentInfo,
            cardName: "",
            cardNumber: "",
            expiryMonth: "",
            expiryYear: "",
            cvv: "",
        });
        }
    };

    const handleAddressSelect = (address: address | null) => {
        if (address) {
        setSelectedAddress(address);
        setShippingInfo({
            ...shippingInfo,
            fullName: address.name || "",
            streetAddress: address.streetAddress,
            streetAddress2: address.streetAddress2 || "",
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber || "",
        });
        } else {
        // Reset the form if "Select an address" is chosen
        setSelectedAddress(null);
        setShippingInfo({
            ...shippingInfo,
            fullName: "",
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
        });
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
                {addresses.length > 0 && (
                    <AddressDropdown data={addresses} select={handleAddressSelect} value={selectedAddress} />
                )}

                {/* Shipping Information Input Fields */}
                <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="gray"
                    value={shippingInfo.fullName}
                    onChangeText={(text) => setShippingInfo({ ...shippingInfo, fullName: text })}
                    className="p-3 border border-gray-300 rounded-lg mb-3"
                    style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                    placeholder="Street Address"
                    placeholderTextColor="gray"
                    value={shippingInfo.streetAddress}
                    onChangeText={(text) => setShippingInfo({ ...shippingInfo, streetAddress: text })}
                    className="p-3 border border-gray-300 rounded-lg mb-3"
                    style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                    placeholder="Street Address 2 (Optional)"
                    placeholderTextColor="gray"
                    value={shippingInfo.streetAddress2}
                    onChangeText={(text) => setShippingInfo({ ...shippingInfo, streetAddress2: text })}
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
                    placeholder="Zip Code"
                    placeholderTextColor="gray"
                    value={shippingInfo.zipCode}
                    onChangeText={(text) => setShippingInfo({ ...shippingInfo, zipCode: text })}
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
                <TouchableOpacity className="p-2" onPress={()=>handleAddressSelect(null)}>
                    <View>
                        <Text className="text-red-500" style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
                            Clear
                        </Text>
                    </View>
                </TouchableOpacity>
                </View>

                {/* Payment Information */}
                <View className="bg-white rounded-lg p-4 mb-4">
                <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
                    Payment Information
                </Text>
                {paymentMethods.length > 0 && (
                    <PaymentMethodsDropdown data={paymentMethods} select={handlePaymentMethodSelect} value={selectedPaymentMethod} />
                )}
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
                    value={paymentInfo.cardName}
                    onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardName: text })}
                    className="p-3 border border-gray-300 rounded-lg mb-3"
                    style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                    placeholder="Expiration Date (MM)"
                    placeholderTextColor="gray"
                    value={paymentInfo.expiryMonth}
                    onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryMonth: text })}
                    className="p-3 border border-gray-300 rounded-lg mb-3"
                    style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                />
                <TextInput
                    placeholder="Expiration Date (YY)"
                    placeholderTextColor="gray"
                    value={paymentInfo.expiryYear}
                    onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryYear: text })}
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
                <TouchableOpacity className="p-2" onPress={()=>handlePaymentMethodSelect(null)}>
                    <View>
                        <Text className="text-red-500" style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
                            Clear
                        </Text>
                    </View>
                </TouchableOpacity>
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