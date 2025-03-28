import { 
    View, 
    useWindowDimensions, 
    TouchableOpacity, 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard, 
    ActivityIndicator
} from "react-native";
import SignOutButton from "../../components/SignOutButton";
import { Redirect, router } from "expo-router";
import { useUserData } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { uploadAvatar, updateUsername } from "@/lib/apiCalls";
import { SafeAreaView } from "react-native-safe-area-context";
import EditProfilePictureModal from "@/components/UploadImageOptionModal";
import EditableProfilePicture from "@/components/EditableProfilePicture";
import ProfilePicture from "@/components/ProfilePicture";
import RoundedTextInput from "@/components/RoundedTextInput";
import ErrorText from "@/components/ErrorText";
import CustomText from "@/components/CustomText";
import { uploadImage } from "@/lib/imageUpload";
import { BASE_URL } from "@/lib/apiCalls";

export default function SettingPage() {
    const {userData, setUserData, fetchUserData} = useUserData();
    const {width} = useWindowDimensions();
    const [isEditingProfile, setEditingProfile] = useState(false);
    const [isEditingProfilePicture, setEditingProfilePicture ] = useState(false);
    const imageWidth = width * 0.25;
    const [loading, setLoading] = useState(false);

    // New state to track original image URI
    const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const [username, setUsername] = useState("");
    const [previousUsername, setPreviousUsername] = useState("");

    const [usernameError, setUsernameError] = useState(false);

    // Redirect if user is not logged in
    if (!userData) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    useEffect(() => {
        setLoading(true);
    
        if (userData.name !== undefined) {
            setUsername(userData.name);
            setPreviousUsername(userData.name);
            if(userData.avatarFileURI){
                setImageUri(BASE_URL + userData.avatarFileURI);
                setOriginalImageUri(BASE_URL + userData.avatarFileURI); 
            }
    
            setLoading(false);
        }
    }, [userData.name, userData.avatarFileURI]);

    const removeImage = () => {
        setImageUri(null);
    }

    const saveImage = (image: string) => {
        setImageUri(image);
        setEditingProfilePicture(false);
    };

    const saveChanges = async () => {
        if (username === "") {
            setUsernameError(true);
            return;
        }
    
        try {
            // Update the avatar if it has changed
            if (originalImageUri !== imageUri) {
                const fileURI = await uploadAvatar(originalImageUri, imageUri, userData.id);
                if (fileURI) {
                    // Update the userData context with the new avatar URI
                    setUserData({ ...userData, avatarFileURI: fileURI });
                    setOriginalImageUri(BASE_URL + imageUri); // Update the original image state
                } else {
                    setUserData({ ...userData, avatarFileURI: null});
                    setOriginalImageUri(null); 
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
        setImageUri(originalImageUri); // Reset to the original image
        setUsername(previousUsername);
        setEditingProfile(false); // Close the modal
    };

    const clearUsername = () => {
        setUsername("");
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200">
            {loading ? ( // Show loading indicator while data is being fetched
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator size="large" color="gray" />
                    </View>
            ):(
            <View>
                <ProfilePicture imageUri={imageUri} imageWidth={imageWidth} name={userData.name}/>
                <View className="flex px-2 w-full">
                    <View className="w-full flex-row justify-between p-2 mb-4"> 
                        <TouchableOpacity className="w-[20%] flex justify-center items-center" activeOpacity={0.7} 
                        onPress={()=>router.push({
                        pathname: "/(tabs)/address"})}>
                            <View className="flex justify-center items-center">
                                <FontAwesome5 name="address-book" size={20} color="gray" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="w-[20%] flex justify-center items-center" activeOpacity={0.7}
                        onPress={()=>router.push({
                        pathname: "/(tabs)/orderList"})}>
                            <View className="flex justify-center items-center">
                                <FontAwesome5 name="box" size={20} color="gray" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="w-[20%] flex justify-center items-center" activeOpacity={0.7}
                        onPress={()=>router.push({
                        pathname: "/(tabs)/payments"})}>
                            <View className="flex justify-center items-center">
                                <FontAwesome5 name="wallet" size={20} color="gray" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="w-[20%] flex justify-center items-center" activeOpacity={0.7} 
                        onPress={()=>router.push({
                        pathname: "/(tabs)/shopDashboard"})}>
                            <View className="flex justify-center items-center">
                                <FontAwesome5 name="store" size={20} color="gray" />
                            </View>
                        </TouchableOpacity>


                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setEditingProfile(true)} className="my-2 bg-white p-2 rounded-3xl w-full">
                        <View className="w-full">
                            <View className="flex-row justify-center items-center">
                                <FontAwesome className="mr-2" name="edit" size={20} color="gray"/>
                                <CustomText text="Edit profile" style={{fontSize: 18}} />
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
                                            <CustomText text="Save" style={{fontSize: 18, color: "#3b82f6"}} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <EditableProfilePicture imageUri={imageUri} imageWidth={imageWidth} setEdit={setEditingProfilePicture} style={{marginLeft: 16}}/>
                                <RoundedTextInput value={username} setValue={setUsername} clearValue={clearUsername} placeholder="Enter username here" maxLength={20}/>
                                {usernameError && 
                                <ErrorText message="You can't leave your username blank." style={{
                                    padding: 12
                                }}/>}
                            </View>
                        </TouchableWithoutFeedback>
                        <EditProfilePictureModal haveRemove={true} visible={isEditingProfilePicture} onClose={()=>setEditingProfilePicture(false)} onUpload={(mode: string)=>uploadImage(mode, saveImage)} onRemove={removeImage}/>
                    </Modal>
                </View>
            </View>
            )}
        </SafeAreaView>
    );
}
