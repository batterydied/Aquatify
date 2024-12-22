import { useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { useEffect } from 'react';
import SignOutButton from '../../components/sign-out';

export default function HomePage() {
  const { user, isLoaded } = useUser(); // Check if the user is signed in

  useEffect(() => {
    if (!isLoaded) {
      // You can handle the loading state here if necessary, e.g., log or show loading spinner
      console.log('User data is still loading...');
    }
  }, [isLoaded]); //

  return (
    <View className="flex-1 justify-center items-center">
        <Text>
            Hello {user?.fullName}
        </Text>
        <SignOutButton />
    </View>
  );
}
