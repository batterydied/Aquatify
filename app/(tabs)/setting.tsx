import { Text, View, Image, useWindowDimensions, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router';
import { useUserData } from '@/contexts/UserContext';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function SettingPage() {
    const { userData, setUserData } = useUserData();
    const { width } = useWindowDimensions();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
    const imageWidth = width * 0.25;
    const [ image, setImage ] = useState<string | null>(null);

    // Redirect if user is not logged in
    if (!userData) {
        return <Redirect href="/sign-in" />;
    }

    if (userData.avatarFilePath){
        setImage(userData.avatarFilePath);
    }

    const uploadImage = async (mode: string) => {
      try {
        let result: ImagePicker.ImagePickerResult;
    
        if (mode === 'gallery') {
          // Request media library permissions
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) {
            alert('Permission to access the gallery is required!');
            return;
          }
    
          // Launch image library
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        } else {
          // Request camera permissions
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            alert('Permission to access the camera is required!');
            return;
          }
    
          // Launch camera
          result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.front,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
        }
    
        // Check if the operation was canceled
        if (!result.canceled) {
          console.log(result);
          await saveImage(result.assets[0].uri); // Save the image URI
        }
      } catch (error) {
        console.error(error);
        alert('Error uploading image');
      }
    };
    

    const saveImage = async (image: string)=>{
        try{
            setImage(image);
            setIsEditingProfilePicture(false);
        }catch(error){

        }
    }
    return (
        <View className="flex-1 justify-center items-center bg-gray-200">
            <View className="m-3 relative">
                <Image
                    className="rounded-full border-2 border-gray-400"
                    style={{
                        width: imageWidth,
                        height: imageWidth,
                    }}
                    resizeMode="cover"
                    source={
                        /*userData.avatarFilePath*/ image
                            ? { /*uri: `http://localhost:3000/api/file/${userData.avatarFilePath}`*/uri:image }
                            : require('../../assets/images/default-avatar-icon.png')
                    }
                />
                <TouchableOpacity
                    className="absolute"
                    style={{
                        top: imageWidth - 35, // Adjust distance from the bottom of the image
                        left: imageWidth - 35, // Adjust distance from the right of the image
                    }}
                    activeOpacity={0.7}
                    onPress={() => setIsEditingProfilePicture(true)}
                >
                    <View className="bg-gray-100 p-2 rounded-full">
                        <FontAwesome name="camera" size={20} color="gray" />
                    </View>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" visible={isEditingProfilePicture} transparent={true}>
                <TouchableWithoutFeedback onPress={() => setIsEditingProfilePicture(false)}>
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white flex-col justify-center items-center p-4 rounded-md">
                            <Text className="text-black text-2xl" style={{ fontFamily: "MontserratBold" }}>Profile photo</Text>
                            <View className="flex-row">
                                <TouchableOpacity onPress={()=>uploadImage("camera")}>
                                    <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                        <FontAwesome name="camera" size={20} color="gray" />
                                        <Text style={{ fontFamily: "MontserratRegular" }}>Camera</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>uploadImage("gallery")}>
                                    <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
                                        <FontAwesome name="image" size={20} color="gray" />
                                        <Text style={{ fontFamily: "MontserratRegular" }}>Gallery</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.7} onPress={() => setIsEditingProfile(true)}>
                <View className="bg-gray-600 p-2 rounded-lg my-2">
                    <Text className="text-white">Edit profile</Text>
                </View>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'MontserratRegular' }}>Hello, {userData.name}</Text>
            <Text style={{ fontFamily: 'MontserratRegular' }}>Email: {userData.email}</Text>
            <Text style={{ fontFamily: 'MontserratRegular' }}>ID: {userData.id}</Text>
            <SignOutButton />
            <Modal animationType="slide" visible={isEditingProfile}>
                <View className="p-5 bg-gray-200 flex-1">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="ml-4 mt-16 mb-0 absolute z-10"
                        onPress={() => setIsEditingProfile(false)}
                    >
                        <FontAwesome name="arrow-left" size={20} color="gray" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mt-16">
                        <TouchableOpacity
                            activeOpacity={0.7}
                        >
                            <View className="bg-blue-600 p-2 rounded-lg my-2">
                                <Text className="text-white">Edit profile picture</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
