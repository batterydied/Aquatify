import { useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { useEffect } from 'react';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router'; 

export default function HomePage() {
    const { user, isLoaded } = useUser(); // Check if the user is signed in
    //console.log(user);
    useEffect(() => {
        if (!isLoaded) {
        // You can handle the loading state here if necessary, e.g., log or show loading spinner
        console.log('User data is still loading...');
        }
    }, [isLoaded]);

    if (isLoaded && !user) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text>
                Hello {user?.emailAddresses[0].emailAddress} 
            </Text>
            <SignOutButton />
        </View>
    );
}
