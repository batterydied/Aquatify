import { 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Modal, 
    TouchableWithoutFeedback, 
    ActivityIndicator,
    TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { fetchOrders } from "@/lib/apiCalls";
import { order } from "../../lib/interface";
import { goToProductPage } from "@/lib/goToProductPage";
import BackArrow from "@/components/BackArrow";
import CustomText from "@/components/CustomText";

export default function Orders() {
    const {userData} = useUserData();
    const [orders, setOrders] = useState<order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<order | null>(null);
    const [isViewingOrder, setViewingOrder] = useState(false);
    const {orderId} = useLocalSearchParams();

    // Search functionality
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredOrders, setFilteredOrders] = useState<order[]>([]);

    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    const fetchData = async () => {
        try {
            const data = await fetchOrders(userData.id);
            if (data) {
                // Sort orders by createdAt in descending order (most recent first)
                const sortedOrders = data.sort((a: order, b: order) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
                setFilteredOrders(sortedOrders); // Initialize filtered orders with sorted orders
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData.id) {
            fetchData();
        }
    }, [userData.id]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (orderId) {
                const orderToView = orders.find(order => order.orderId === orderId);
                if (orderToView) {
                    setSelectedOrder(orderToView);
                    setViewingOrder(true);
                }
            }
        }, [orderId, orders])
    );


    // Handle search by the first 8 characters of orderId
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = orders.filter((order) =>
                order.orderId.slice(0, 8).toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders); // Reset to show all orders
        }
    };

    // Handle view order details
    const handleViewOrder = (order: order) => {
        setSelectedOrder(order);
        setViewingOrder(true);
    };

    // Close the order details modal
    const closeOrderDetails = () => {
        setViewingOrder(false);
        setSelectedOrder(null);
        router.setParams({ orderId: undefined });
    };

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
                <CustomText text="Error fetching orders." />
            </SafeAreaView>
        );
    }

    const handleBack = () => router.push("/(tabs)/profile");
    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : (
                <View>
                    <BackArrow handleBack={handleBack} />
                    <ScrollView className="mt-4 p-4">
                        {/* Search Bar */}
                        <TextInput
                            placeholder="Search by Order ID"
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            className="p-3 rounded-3xl mb-4 bg-white"
                            style={{ fontFamily: "MontserratRegular" }}
                        />

                        {/* Orders List */}
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <TouchableOpacity
                                    key={order.orderId}
                                    onPress={() => handleViewOrder(order)}
                                    className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-1">
                                            <CustomText text={`Order #${order.orderId.slice(0, 8)}`} style={{fontSize: 18}} isBold={true} />
                                            <CustomText text={`Created: ${new Date(order.createdAt).toLocaleDateString()}`} style={{color:"#4B5563"}} />
                                            <CustomText text={`Updated: ${new Date(order.updatedAt).toLocaleDateString()}`} style={{color:"#4B5563"}} />
                                            <CustomText text={`Total: $${order.totalPrice.toFixed(2)}`} style={{color:"#4B5563"}} />
                                            <CustomText text={`Status: ${order.status}`} style={{color:"#4B5563"}} />
                                        </View>
                                        <FontAwesome name="chevron-right" size={20} color="gray" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <CustomText text="No orders found." style={{color: "#4B5563", textAlign: "center"}} />
                        )}
                    </ScrollView>

                    {/* Order Details Modal */}
                    <Modal animationType="slide" visible={isViewingOrder}>
                        <TouchableWithoutFeedback onPress={closeOrderDetails}>
                            <View className="flex-1 bg-gray-200 p-4">
                                <View className="flex-row justify-between items-center mb-4 mt-16">
                                    <TouchableOpacity onPress={closeOrderDetails}>
                                        <FontAwesome name="times" size={24} color="gray" />
                                    </TouchableOpacity>
                                    <CustomText text="Order Details" style={{fontSize: 20}} isBold={true} />
                                    <View />
                                </View>

                                {selectedOrder && (
                                    <View className="bg-white rounded-xl p-4 shadow-sm">
                                        <CustomText text={`Order # ${selectedOrder.orderId.slice(0, 8)}`} style={{fontSize: 18, marginBottom: 8}} isBold={true} />
                                        <CustomText text={`Updated:  ${new Date(selectedOrder.updatedAt).toLocaleDateString()}`} style={{color:"#4B5563"}} />
                                        <CustomText text={`Status: ${selectedOrder.status}`} style={{color:"#4B5563"}} />

                                        <View className="mt-4">
                                            <CustomText text="Shipping Address" style={{fontSize: 18}} isBold={true} />

                                            <CustomText text={selectedOrder.name} style={{color:"#4B5563"}} />
                                            <CustomText text={selectedOrder.streetAddress} style={{color:"#4B5563"}} />
                                            {selectedOrder.streetAddress2 && (
                                                    <CustomText text={selectedOrder.streetAddress2} style={{color:"#4B5563"}}/> 
                                            )}
                                            <CustomText text={`${selectedOrder.city}, ${selectedOrder.state} ${selectedOrder.zipCode}`} style={{color:"#4B5563"}} />
                                            <CustomText text={`Phone: ${selectedOrder.phoneNumber}`} style={{color:"#4B5563"}} />
                                        </View>

                                        <View className="mt-4">
                                            <CustomText text="Products" style={{fontSize: 18}} isBold={true} />
                                            {selectedOrder.orderProducts.map((product) => (
                                                <TouchableOpacity key={product.productId} activeOpacity={0.7} onPress={()=>goToProductPage(product.productId, "orders", selectedOrder.orderId)} >
                                                    <View className="mt-2">
                                                        <CustomText text={`Product ID: ${product.productId.slice(0, 4)}...${product.productId.slice(-4)}`} style={{color:"#4B5563"}} />
                                                        <CustomText text={`${product.productName} (${product.productType})`} style={{color:"#4B5563"}} />
                                                        <CustomText text={`Quantity: ${product.quantity}`} style={{color:"#4B5563"}} />
                                                        <CustomText text={`Price: $${product.priceAtTimeOfOrder.toFixed(2)}`} style={{color:"#4B5563"}} />
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        <View className="mt-4">
                                            <CustomText text="Payment Summary" style={{fontSize: 18}} isBold={true} />
                                            <CustomText text={`Subtotal: $${selectedOrder.subtotal.toFixed(2)}`} style={{color:"#4B5563"}} />
                                            <CustomText text={`Tax: $${selectedOrder.tax.toFixed(2)}`} style={{fontSize: 18}} />
                                            <CustomText text={`Total: $${selectedOrder.totalPrice.toFixed(2)}`} style={{fontSize: 18}} />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            )}
        </SafeAreaView>
    );
}