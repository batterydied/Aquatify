import { Text, View, Image, useWindowDimensions, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router';
import { useUserData } from '@/contexts/UserContext';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '@/lib/utils';

export default function SettingPage() {
    const { userData, setUserData } = useUserData();
    const { width } = useWindowDimensions();
    const [isEditingProfile, setEditingProfile] = useState(false);
    const [isEditingProfilePicture, setEditingProfilePicture] = useState(false);
    const imageWidth = width * 0.25;

    // New state to track original image URI
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    // Redirect if user is not logged in
    if (!userData) {
        return <Redirect href="/sign-in" />;
    }

    useEffect(() => {
        if (userData.avatarFileURI) {
            setImage(userData.avatarFileURI);
            setOriginalImage(userData.avatarFileURI); // Set original image initially
        }
    }, [userData.avatarFileURI]);

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

    const saveImage = (image: string) => {
        setImage(image);
        setEditingProfilePicture(false);
    };

    const discardChanges = () => {
        setImage(originalImage); // Reset to the original image
        setEditingProfile(false); // Close the modal
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-200">
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
            <TouchableOpacity activeOpacity={0.7} onPress={() => setEditingProfile(true)} className="m-4 bg-white p-2 rounded-lg">
                <View>
                    <Text style={{ fontFamily: "MontserratRegular" }} className="text-lg">
                        Edit profile
                    </Text>
                </View>
            </TouchableOpacity>
            <SignOutButton />
            <Modal animationType="slide" visible={isEditingProfile}>
                <View className="flex-1 bg-gray-200 justify-center items-center">
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
                    <TouchableOpacity onPress={() => {
                        uploadAvatar(null, image, userData.id);
                        setOriginalImage(image); // Update original image upon save
                        setEditingProfile(false);
                    }}>
                        <View className="rounded-lg m-2">
                            <Text className="text-blue-500 text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                Save changes
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={discardChanges}>
                        <View className="rounded-lg m-2">
                            <Text className="text-red-500 text-lg" style={{ fontFamily: "MontserratRegular" }}>
                                Discard changes
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Modal for editing profile picture */}
                    <Modal animationType="slide" visible={isEditingProfilePicture} transparent={true}>
                        <TouchableWithoutFeedback onPress={() => setEditingProfilePicture(false)}>
                            <View className="flex-1 justify-center items-center bg-black/50">
                                <View className="bg-white flex-col justify-center items-center p-4 rounded-md">
                                    <Text className="text-black text-2xl" style={{ fontFamily: "MontserratBold" }}>Profile photo</Text>
                                    <View className="flex-row">
                                        <TouchableOpacity onPress={() => uploadImage("camera")}>
                                            <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                                <FontAwesome name="camera" size={20} color="gray" />
                                                <Text style={{ fontFamily: "MontserratRegular" }}>Camera</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => uploadImage("gallery")}>
                                            <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                                <FontAwesome name="image" size={20} color="gray" />
                                                <Text style={{ fontFamily: "MontserratRegular" }}>Gallery</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </Modal>
        </View>
    );
}
