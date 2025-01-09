import { Text, View } from 'react-native';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router'; 
import { useUserData } from '@/contexts/UserContext';

export default function SettingPage() {
    const { userData } = useUserData();

    // If the user is not signed in, redirect to the sign-in page
    if (!userData) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text style={{ fontFamily: "MontserratRegular" }}>
                Hello, {userData.email}
            </Text>
            <Text style={{ fontFamily: "MontserratRegular" }}>
                ID: {userData.id}
            </Text>
            <SignOutButton />
        </View>
    );
}
