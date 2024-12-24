import { useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import SignOutButton from '../../components/sign-out';
import { Redirect } from 'expo-router';  // Correct usage of Redirect
import { fetchUserData, User } from '../../lib/user';


export default function HomePage() {
    const { user, isLoaded } = useUser(); // Check if the user is signed in
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        if (!isLoaded) {
            // Optionally handle loading state
            console.log('User data is still loading...');
            return; // Prevent code execution until isLoaded is true
        }

        if (!user) {
            // If the user is not authenticated, redirect to the sign-in page
            return;
        }

        // Fetch user data once the user is available and isLoaded is true
        const fetchData = async () => {
            try {
                const data = await fetchUserData(user.emailAddresses[0].emailAddress);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [isLoaded, user]);

    // If the user is not signed in, redirect to the sign-in page
    if (isLoaded && !user) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text>
                Hello {user?.emailAddresses[0].emailAddress}
            </Text>
            <Text>
                {userData?.id}
            </Text>
            <SignOutButton />
        </View>
    );
}
