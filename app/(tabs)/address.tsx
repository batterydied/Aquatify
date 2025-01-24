import { Text, View, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, TextInput, Keyboard, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useUserData } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { saveEditedAddress, addNewAddress, deleteAddress, fetchAddresses } from "@/lib/apiCalls";
import { address } from "@/lib/interface";
import { isValidZipCode } from "../../lib/isValidZipCode";

export default function Address() {
    const { userData } = useUserData();
    const [addresses, setAddresses] = useState<address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isEditingAddress, setEditingAddress] = useState(false);
    const [isAddingAddress, setAddingAddress] = useState(false); // State for adding address
    const [selectedAddress, setSelectedAddress] = useState<address | null>(null);
    const [newAddress, setNewAddress] = useState<Partial<address>>({}); // State for new address
    
    // Fetch addresses from the API
    const fetchData = async () => {
        try {
            const data = await fetchAddresses(userData!.id);
            if(data){
                setAddresses(data);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData?.id) {
            fetchData();
        }
    }, [userData?.id]);

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [])
    );

    // Handle edit action
    const handleEdit = (address: address) => {
        setSelectedAddress(address);
        setEditingAddress(true);
    };

    // Handle delete action
    const handleDelete = async (addressId: string) => {
        Alert.alert(
            "Delete Address",
            "Are you sure you want to delete this address?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteAddress(addressId);
                            fetchData(); // Refresh the list
                        } catch {
                            alert('Error deleting address');
                        }
                    },
                },
            ]
        );
    };

    // Save edited address
    const handleSaveEditedAddress = async (selectedAddress: address | null) => {
        if (!selectedAddress) {
            return;
        }
        if(!isValidZipCode(selectedAddress.zipCode)){
            alert('Please enter a valid zip code');
            return;
        }
        try {
            await saveEditedAddress(selectedAddress);
            fetchData(); // Refresh the list
            setEditingAddress(false);
        } catch {
            alert('Error updating address');
        }
    };

    // Save new address
    const handleSaveNewAddress = async () => {
        if (!newAddress.streetAddress || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.name || !newAddress.phoneNumber) {
            alert('Please fill in all required fields');
            return;
        }
        if(!isValidZipCode(newAddress.zipCode)){
            alert('Please enter a valid zip code');
            return;
        }
        try {
            await addNewAddress({ ...newAddress, userId: userData?.id } as address);
            fetchData(); // Refresh the list
            setAddingAddress(false);
            setNewAddress({}); // Reset new address form
        } catch {
            alert('Error adding address');
        }
    };

    // Discard changes and close the modal
    const discardChanges = () => {
        setEditingAddress(false);
        setSelectedAddress(null);
    };

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
                <Text style={{ fontFamily: "MontserratRegular" }}>Error fetching addresses.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator size="large" color="gray" />
                    </View>
                  ):
            (<View>
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
                    {/* Add Address Button */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setAddingAddress(true)}
                        className="bg-blue-500 p-4 rounded-xl mb-4"
                    >
                        <Text style={{ fontFamily: "MontserratRegular" }} className="text-white text-center text-lg">
                            Add New Address
                        </Text>
                    </TouchableOpacity>

                    {/* Address List */}
                    {addresses.map((address) => (
                    <View key={address.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                        <View className="flex-row justify-between items-center">
                            {/* Edit Button */}
                            <TouchableOpacity onPress={() => handleEdit(address)}>
                                <FontAwesome name="edit" size={20} color="gray" className="mr-2" />
                            </TouchableOpacity>

                            {/* Address Details */}
                            <View className="flex-1">
                                <Text style={{ fontFamily: "MontserratRegular" }} className="text-lg">
                                    {address.streetAddress}
                                    {address.streetAddress2 && `, ${address.streetAddress2}`}
                                </Text>
                                <Text style={{ fontFamily: "MontserratRegular" }} className="text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                </Text>
                            </View>

                            {/* Trash Icon */}
                            <TouchableOpacity onPress={() => handleDelete(address.id)}>
                                <FontAwesome name="trash" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                </ScrollView>

                {/* Edit Address Modal */}
                <Modal animationType="slide" visible={isEditingAddress}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 bg-gray-200 p-4">
                            <View className="flex-row justify-between items-center mb-4 mt-16">
                                <TouchableOpacity onPress={discardChanges}>
                                    <FontAwesome name="times" size={24} color="gray" />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: "MontserratBold" }} className="text-xl">
                                    Edit Address
                                </Text>
                                <TouchableOpacity onPress={() => handleSaveEditedAddress(selectedAddress)}>
                                    <Text style={{ fontFamily: "MontserratRegular" }} className="text-blue-500 text-lg">
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="bg-white rounded-xl p-4">
                                <TextInput
                                    value={selectedAddress?.name || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, name: text });
                                        }
                                    }}
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={selectedAddress?.streetAddress || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, streetAddress: text });
                                        }
                                    }}
                                    placeholder="Street Address"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={selectedAddress?.streetAddress2 || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, streetAddress2: text });
                                        }
                                    }}
                                    placeholder="Address Line 2"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={selectedAddress?.city || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, city: text });
                                        }
                                    }}
                                    placeholder="City"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={selectedAddress?.state || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, state: text });
                                        }
                                    }}
                                    placeholder="State"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={selectedAddress?.zipCode || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, zipCode: text });
                                        }
                                    }}
                                    placeholder="Zip Code"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                 <TextInput
                                    value={selectedAddress?.phoneNumber || ""}
                                    onChangeText={(text) => {
                                        if (selectedAddress) {
                                            setSelectedAddress({ ...selectedAddress, phoneNumber: text });
                                        }
                                    }}
                                    placeholder="Phone Number"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Add Address Modal */}
                <Modal animationType="slide" visible={isAddingAddress}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 bg-gray-200 p-4">
                            <View className="flex-row justify-between items-center mb-4 mt-16">
                                <TouchableOpacity onPress={() => setAddingAddress(false)}>
                                    <FontAwesome name="times" size={24} color="gray" />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: "MontserratBold" }} className="text-xl">
                                    Add New Address
                                </Text>
                                <TouchableOpacity onPress={handleSaveNewAddress}>
                                    <Text style={{ fontFamily: "MontserratRegular" }} className="text-blue-500 text-lg">
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="bg-white rounded-xl p-4">
                                <TextInput
                                    value={newAddress.name || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.streetAddress || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, streetAddress: text })}
                                    placeholder="Street Address"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.streetAddress2 || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, streetAddress2: text })}
                                    placeholder="Address Line 2"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.city || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                                    placeholder="City"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.state || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
                                    placeholder="State"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.zipCode || ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, zipCode: text })}
                                    placeholder="Zip Code"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                                <TextInput
                                    value={newAddress.phoneNumber|| ""}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, phoneNumber: text })}
                                    placeholder="Phone Number"
                                    placeholderTextColor="gray"
                                    style={{ fontFamily: "MontserratRegular" }}
                                    className="border-b border-gray-300 py-2"
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>)}
        </SafeAreaView>
    );
}