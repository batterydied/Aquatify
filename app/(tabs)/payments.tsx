import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
  } from "react-native";
  import { useCallback, useState } from "react";
  import { useUserData } from "@/contexts/UserContext";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
  import { router, useFocusEffect } from "expo-router";
  import { paymentMethod } from "@/lib/interface";
  import { fetchPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "@/lib/apiCalls";
  import { FontAwesome } from "@expo/vector-icons";
  import { validateCardName, validateCardNumber, validateExpiryMonth, validateExpiryYear, validateCVV } from "@/lib/validatePayments";
import BackArrow from "@/components/BackArrow";
  
  export default function PaymentsPage() {
    const [paymentMethods, setPaymentMethods] = useState<paymentMethod[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {userData} = useUserData();
    const {width} = useWindowDimensions();
  
    // Payment Information State
    const [paymentInfo, setPaymentInfo] = useState({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardName: "",
    });
  
    // State to track the payment method being edited
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<paymentMethod | null>(null);
  
    const [fontsLoaded] = useFonts({
      MontserratRegular: Montserrat_400Regular,
      MontserratBold: Montserrat_700Bold,
    });
  
    if (!userData) {
      router.push("/(auth)/sign-in");
      return null;
    }
  
    // Fetch payment methods on focus
    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPaymentMethods(userData.id);
        setPaymentMethods(data || []);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        Alert.alert("Error", "Failed to fetch payment methods.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleAddPaymentMethod = async () => {
      // Validate all fields
      if (!validateCardNumber(paymentInfo.cardNumber)) {
        Alert.alert("Error", "Please enter a valid card number.");
        return;
      }
      if (!validateExpiryMonth(paymentInfo.expiryMonth)) {
        Alert.alert("Error", "Please enter a valid expiry month (MM).");
        return;
      }
      if (!validateExpiryYear(paymentInfo.expiryYear)) {
        Alert.alert("Error", "Please enter a valid expiry year (YY).");
        return;
      }
      if (!validateCVV(paymentInfo.cvv)) {
        Alert.alert("Error", "Please enter a valid CVV (3 or 4 digits).");
        return;
      }
      if (!validateCardName(paymentInfo.cardName)) {
        Alert.alert("Error", "Please enter the cardholder's name.");
        return;
      }
  
      setLoading(true);
      try {
        if (editingPaymentMethod) {
          // Update existing payment method
          await updatePaymentMethod(userData.id, editingPaymentMethod.id, paymentInfo);
          Alert.alert("Success", "Payment method updated successfully!");
        } else {
          // Add new payment method
          await addPaymentMethod(userData.id, paymentInfo);
          Alert.alert("Success", "Payment method added successfully!");
        }
  
        // Reset form and fetch updated data
        setPaymentInfo({
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          cardName: "",
        });
        setEditingPaymentMethod(null);
        fetchData();
      } catch (error) {
        console.error("Error saving payment method:", error);
        Alert.alert("Error", "Failed to save payment method.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleEditPaymentMethod = (method: paymentMethod) => {
      // Populate the form with the selected payment method's data
      setPaymentInfo({
        cardNumber: method.cardNumber,
        expiryMonth: method.expiryMonth,
        expiryYear: method.expiryYear,
        cvv: method.cvv,
        cardName: method.cardName,
      });
      setEditingPaymentMethod(method);
    };
  
    const handleDeletePaymentMethod = async (methodId: string) => {
      Alert.alert(
        "Delete Payment",
        "Are you sure you want to delete this payment method?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await deletePaymentMethod(userData.id, methodId);
                Alert.alert("Success", "Payment method deleted successfully!");
                fetchData(); // Refresh the list
              } catch {
                Alert.alert("Error", "Failed to delete payment method.");
              }
            },
          },
        ]
      );
    };
  
    const handleCancel = () => {
      // Reset the form and clear the editing state
      setPaymentInfo({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardName: "",
      });
      setEditingPaymentMethod(null);
    };
    
    const handleBack = () => router.push("/(tabs)/profile");

    const renderPaymentMethod = (method: paymentMethod) => {
      return (
        <View key={method.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
          <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04 }}>
            {method.cardName}
          </Text>
          <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
            {`**** **** **** ${method.cardNumber.slice(-4)}`}
          </Text>
          <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}>
            {`Expires: ${method.expiryMonth}/${method.expiryYear}`}
          </Text>
          <View className="flex-row justify-between mt-2 items-center">
            <TouchableOpacity onPress={() => handleEditPaymentMethod(method)}>
              <FontAwesome name="edit" size={20} color="gray" className="mr-2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePaymentMethod(method.id)}>
              <FontAwesome name="trash" size={20} color="gray" className="mr-2" />
            </TouchableOpacity>
          </View>
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
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator size="large" color="gray" />
                    </View>
                  ):
            (<TouchableWithoutFeedback>
                <View>
                    <BackArrow handleBack={handleBack} />
                    <ScrollView className="mt-4 p-4">
                    <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.06, marginBottom: 20 }}>
                        Payment Methods
                    </Text>
        
                    {/* List of Saved Payment Methods */}
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map((method) => renderPaymentMethod(method))
                    ) : (
                        <Text style={{ fontFamily: "MontserratRegular", fontSize: width * 0.04, marginBottom: 20 }}>
                        No payment methods saved.
                        </Text>
                    )}
        
                    {/* Add/Edit Payment Method Form */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, marginBottom: 10 }}>
                        {editingPaymentMethod ? "Edit Payment Method" : "Add New Payment Method"}
                        </Text>
                        <TextInput
                        placeholder="Cardholder Name"
                        placeholderTextColor="gray"
                        value={paymentInfo.cardName}
                        onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardName: text })}
                        className="p-3 border border-gray-300 rounded-lg mb-3"
                        style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                        />
                        <TextInput
                        placeholder="Card Number"
                        placeholderTextColor="gray"
                        value={paymentInfo.cardNumber}
                        onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
                        className="p-3 border border-gray-300 rounded-lg mb-3"
                        style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                        keyboardType="numeric"
                        />
                        <View className="flex-row justify-between mb-3">
                        <TextInput
                            placeholder="MM"
                            placeholderTextColor="gray"
                            value={paymentInfo.expiryMonth}
                            onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryMonth: text })}
                            className="p-3 border border-gray-300 rounded-lg flex-1 mr-2"
                            style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                            keyboardType="numeric"
                        />
                        <TextInput
                            placeholder="YY"
                            placeholderTextColor="gray"
                            value={paymentInfo.expiryYear}
                            onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryYear: text })}
                            className="p-3 border border-gray-300 rounded-lg flex-1 ml-2"
                            style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                            keyboardType="numeric"
                        />
                        </View>
                        <TextInput
                        placeholder="CVV"
                        placeholderTextColor="gray"
                        value={paymentInfo.cvv}
                        onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
                        className="p-3 border border-gray-300 rounded-lg mb-3"
                        style={{ fontFamily: "MontserratRegular", fontSize: width * 0.035 }}
                        keyboardType="numeric"
                        secureTextEntry
                        />
                        <View className="flex-row justify-between">
                        {editingPaymentMethod && (
                            <TouchableOpacity
                            className="bg-gray-500 p-4 rounded-full items-center flex-1 mr-2"
                            onPress={handleCancel}
                            disabled={loading}
                            >
                            <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, color: "white" }}>
                                Cancel
                            </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            className="bg-orange-400 p-4 rounded-full items-center flex-1 ml-2"
                            onPress={handleAddPaymentMethod}
                            disabled={loading}
                        >
                            {loading ? (
                            <ActivityIndicator size="small" color="white" />
                            ) : (
                            <Text style={{ fontFamily: "MontserratBold", fontSize: width * 0.04, color: "white" }}>
                                {editingPaymentMethod ? "Update" : "Add"}
                            </Text>
                            )}
                        </TouchableOpacity>
                        </View>
                    </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>)}
        </SafeAreaView>
    );
  }