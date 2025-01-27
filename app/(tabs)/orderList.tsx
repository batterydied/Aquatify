import { 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Modal, 
    TouchableWithoutFeedback, 
    ActivityIndicator,
    TextInput, // Added for search input
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { fetchOrders } from "@/lib/apiCalls";
import { order } from "../../lib/interface";

export default function Orders() {
    const {userData} = useUserData();
    const [orders, setOrders] = useState<order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [ selectedOrder, setSelectedOrder] = useState<order | null>(null);
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

    const goToProductPage = (productId: string, orderId: string) => {
        closeOrderDetails();
        router.push({
            pathname: "/(tabs)/product" as any,
            params: {
               productId,
               fromPage: "/(tabs)/orders",
               orderId
            }
        });
    };

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
                <Text style={{ fontFamily: "MontserratRegular" }}>Error fetching orders.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : (
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="ml-4 mb-0 absolute z-10"
                        onPress={() => router.push("/(tabs)/profile")}
                    >
                        <FontAwesome
                            name="arrow-left"
                            size={20}
                            color="gray"
                            className="ml-2"
                        />
                    </TouchableOpacity>
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
                                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                                Order #{order.orderId.slice(0, 8)}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Created: {new Date(order.createdAt).toLocaleDateString()}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Updated: {new Date(order.updatedAt).toLocaleDateString()}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Total: ${order.totalPrice.toFixed(2)}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Status: {order.status}
                                            </Text>
                                        </View>
                                        <FontAwesome name="chevron-right" size={20} color="gray" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600 text-center">
                                No orders found.
                            </Text>
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
                                    <Text style={{ fontFamily: "MontserratBold" }} className="text-xl">
                                        Order Details
                                    </Text>
                                    <View />
                                </View>

                                {selectedOrder && (
                                    <View className="bg-white rounded-xl p-4 shadow-sm">
                                        <Text style={{ fontFamily: "MontserratBold" }} className="text-lg mb-2">
                                            Order #{selectedOrder.orderId.slice(0, 8)}
                                        </Text>
                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                            Updated: {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                                        </Text>
                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                            Status: {selectedOrder.status}
                                        </Text>

                                        <View className="mt-4">
                                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                                Shipping Address
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                {selectedOrder.name}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                {selectedOrder.streetAddress}
                                                {selectedOrder.streetAddress2 && (
                                                    <Text>, {selectedOrder.streetAddress2}</Text>
                                                )}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Phone: {selectedOrder.phoneNumber}
                                            </Text>
                                        </View>

                                        <View className="mt-4">
                                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                                Products
                                            </Text>
                                            {selectedOrder.orderProducts.map((product) => (
                                                <TouchableOpacity key={product.productId} activeOpacity={0.7} onPress={()=>goToProductPage(product.productId, selectedOrder.orderId)} >
                                                    <View className="mt-2">
                                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                            Product ID: {product.productId.slice(0, 4)}...{product.productId.slice(-4)}
                                                        </Text>
                                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                            {product.productName} ({product.productType})
                                                        </Text>
                                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                            Quantity: {product.quantity}
                                                        </Text>
                                                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                            Price: ${product.priceAtTimeOfOrder.toFixed(2)}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        <View className="mt-4">
                                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                                Payment Summary
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Subtotal: ${selectedOrder.subtotal.toFixed(2)}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                                Tax: ${selectedOrder.tax.toFixed(2)}
                                            </Text>
                                            <Text style={{ fontFamily: "MontserratBold" }} className="text-lg">
                                                Total: ${selectedOrder.totalPrice.toFixed(2)}
                                            </Text>
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