import { Text, View, Image, useWindowDimensions } from 'react-native';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router'; 
import { useUserData } from '@/contexts/UserContext';

export default function SettingPage() {
    const { userData } = useUserData();
    const { width } = useWindowDimensions();
    const imageWidth = width * 0.25;
    // If the user is not signed in, redirect to the sign-in page
    if (!userData) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Image className="rounded-full"
            style={{
                width: imageWidth,
                height: imageWidth,
            }} 
            resizeMode="cover"
            source={userData.avatarFilePath ? ({uri: `localhost:3000/api/file/${userData.avatarFilePath}`}) : (require('../../assets/images/default-avatar-icon.png'))}/>
            
            <Text style={{ fontFamily: "MontserratRegular" }}>
                Hello, {userData.name}
            </Text>
            <Text style={{ fontFamily: "MontserratRegular" }}>
                Email: {userData.email}
            </Text>
            <Text style={{ fontFamily: "MontserratRegular" }}>
                ID: {userData.id}
            </Text>
            <SignOutButton />
        </View>
    );
}
