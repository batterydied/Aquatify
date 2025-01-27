import { 
    Text, 
    View, 
    Image, 
    useWindowDimensions, 
    TouchableOpacity, 
    Modal, 
    TouchableWithoutFeedback, 
    TextInput, 
    Keyboard 
} from "react-native";
import SignOutButton from "../../components/SignOutButton";
import { Redirect, router } from "expo-router";
import { useUserData } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar, updateUsername } from "@/lib/apiCalls";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingPage() {
    const {userData, setUserData} = useUserData();
    const {width} = useWindowDimensions();
    const [isEditingProfile, setEditingProfile] = useState(false);
    const [isEditingProfilePicture, setEditingProfilePicture ] = useState(false);
    const imageWidth = width * 0.25;

    // New state to track original image URI
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const [ username, setUsername ] = useState("");
    const [ previousUsername, setPreviousUsername ] = useState("");

    const [ usernameError, setUsernameError ] = useState(false);

    // Redirect if user is not logged in
    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    useEffect(() => {
        if (userData.avatarFileURI) {
            setImage(userData.avatarFileURI);
            setOriginalImage(userData.avatarFileURI); // Set original image initially
        }
    }, [userData.avatarFileURI]);

    useEffect(() => {
        if (userData.name) {
            setUsername(userData.name);
            setPreviousUsername(userData.name);
        }
    }, [userData.name]);

    const uploadImage = async (mode: string) => {
        try {
            let result: ImagePicker.ImagePickerResult;

            if (mode === 'gallery') {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    alert('Permission to access the gallery is required!');
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    alert('Permission to access the camera is required!');
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }

            if (!result.canceled) {
                saveImage(result.assets[0].uri); // Save the new image URI
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading image');
        }
    };

    const removeImage = () => {
        setImage(null);
    }

    const saveImage = (image: string) => {
        setImage(image);
        setEditingProfilePicture(false);
    };

    const saveChanges = async () => {
        if (username === "") {
            setUsernameError(true);
            return;
        }
    
        try {
            // Update the avatar if it has changed
            if (originalImage !== image) {
                const avatarResponse = await uploadAvatar(originalImage, image, userData.id);
                if (avatarResponse) {
                    // Update the userData context with the new avatar URI
                    setUserData({ ...userData, avatarFileURI: avatarResponse.file.uri });
                    setOriginalImage(image); // Update the original image state
                } else {
                    setUserData({ ...userData, avatarFileURI: null});
                    setOriginalImage(null); 
                }
            }
    
            // Update the username if it has changed
            if (previousUsername !== username) {
                const usernameResponse = await updateUsername(username, userData.id);
                if (usernameResponse) {
                    // Update the userData context with the new username
                    setUserData({ ...userData, name: username });
                    setPreviousUsername(username); // Update the previous username state
                }
            }
    
            setUsernameError(false);
            setEditingProfile(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const discardChanges = () => {
        setImage(originalImage); // Reset to the original image
        setUsername(previousUsername);
        setEditingProfile(false); // Close the modal
    };

    const clearUsername = () => {
        setUsername("");
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            <View className="p-4">
                <Image
                    className="rounded-full border-2 border-gray-400"
                    style={{
                        width: imageWidth,
                        height: imageWidth,
                    }}
                    resizeMode="cover"
                    source={
                        image
                            ? { uri: image }
                            : require('../../assets/images/default-avatar-icon.png')
                    }
                />
                <Text style={{ fontFamily: "MontserratRegular" }} className="text-lg m-2">
                    {username}
                </Text>
            </View>
            <View className="flex px-2 w-full">
                <View className="w-full flex-row justify-between p-2"> 
                    <TouchableOpacity className="w-[30%] flex justify-center items-center" activeOpacity={0.7} 
                    onPress={()=>router.push({
                    pathname: "/(tabs)/address"})}>
                        <View className="flex justify-center items-center">
                            <FontAwesome5 name="address-book" size={20} color="gray" />
                            <Text className="text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                Address
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-[30%] flex justify-center items-center" activeOpacity={0.7}
                    onPress={()=>router.push({
                    pathname: "/(tabs)/orders"})}>
                        <View className="flex justify-center items-center">
                            <FontAwesome5 name="box" size={20} color="gray" />
                            <Text className="text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                Orders
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-[30%] flex justify-center items-center" activeOpacity={0.7}
                    onPress={()=>router.push({
                    pathname: "/(tabs)/payments"})}>
                        <View className="flex justify-center items-center">
                            <FontAwesome5 name="wallet" size={20} color="gray" />
                            <Text className="text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                Payments
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setEditingProfile(true)} className="my-2 bg-white p-2 rounded-3xl w-full">
                    <View className="w-full">
                        <View className="flex-row justify-center items-center">
                            <FontAwesome className="mr-2" name="edit" size={20} color="gray"/>
                            <Text style={{ fontFamily: "MontserratRegular" }} className="text-lg">
                                Edit profile
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <SignOutButton />
                <Modal animationType="slide" visible={isEditingProfile}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 bg-gray-200">
                            <View className="mt-16 flex-row w-full justify-between px-4">
                                <TouchableOpacity onPress={discardChanges}>
                                    <View className="rounded-lg m-2">
                                        <FontAwesome name="times" color="gray" size={30} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveChanges}>
                                    <View className="rounded-lg m-2">
                                        <Text className="text-blue-500 text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                            Save
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="m-3 relative">
                                <Image
                                    className="rounded-full border-2 border-gray-400"
                                    style={{
                                        width: imageWidth,
                                        height: imageWidth,
                                    }}
                                    resizeMode="cover"
                                    source={
                                        image
                                            ? { uri: image }
                                            : require('../../assets/images/default-avatar-icon.png')
                                    }
                                />
                                <TouchableOpacity
                                    className="absolute"
                                    style={{
                                        top: imageWidth - 35,
                                        left: imageWidth - 35,
                                    }}
                                    activeOpacity={0.7}
                                    onPress={() => setEditingProfilePicture(true)}
                                >
                                    <View className="bg-gray-100 p-2 rounded-full">
                                        <FontAwesome name="camera" size={20} color="gray" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center border border-gray-500 py-1 px-2 m-2 rounded-xl bg-white justify-between">
                                <TextInput value={username} onChangeText={setUsername} className="flex-1" style={{ fontFamily: "MontserratRegular" }}/>
                                <TouchableOpacity onPress={clearUsername} activeOpacity={0.7}>
                                    <FontAwesome name="times-circle" color="gray" size={25} />
                                </TouchableOpacity>
                            </View>
                            {usernameError && 
                            <View className="px-3">
                                <Text className="text-red-500">You can't leave your username blank.</Text>
                            </View>}
                        </View>
                    </TouchableWithoutFeedback>
                        {/* Modal for editing profile picture */}
                        <Modal animationType="slide" visible={isEditingProfilePicture} transparent={true}>
                            <TouchableWithoutFeedback onPress={() => setEditingProfilePicture(false)}>
                                <View className="flex-1 justify-center items-center bg-black/50">
                                    <View className="bg-white flex-col justify-center items-center p-4 rounded-md">
                                        <Text className="text-black text-2xl" style={{ fontFamily: "MontserratBold" }}>Profile photo</Text>
                                        <View className="flex-row">
                                            <TouchableOpacity onPress={() => uploadImage("camera")} className="w-[25%]">
                                                <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                                    <FontAwesome name="camera" size={20} color="gray" />
                                                    <Text style={{ fontFamily: "MontserratRegular" }}>Camera</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => uploadImage("gallery")} className="w-[25%]">
                                                <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                                    <FontAwesome name="image" size={20} color="gray" />
                                                    <Text style={{ fontFamily: "MontserratRegular" }}>Gallery</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={removeImage} className="w-[25%]">
                                                <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                                    <FontAwesome name="trash" size={20} color="gray" />
                                                    <Text style={{ fontFamily: "MontserratRegular" }}>Remove</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
