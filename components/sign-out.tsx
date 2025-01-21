import React from 'react'; // Add this import
import { useClerk } from '@clerk/clerk-expo'; // Import useClerk from @clerk/clerk-expo
import { TouchableOpacity, View, ViewStyle, Text } from 'react-native'; // Basic React Native components
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { FontAwesome } from '@expo/vector-icons';

export default function SignOutButton() {
  const { signOut } = useClerk(); // Access signOut function from Clerk
  const router = useRouter(); // Router to navigate after sign-out

  const handleSignOut = async () => {
    try {
      await signOut(); // Perform sign-out
      router.replace('/sign-in'); // Redirect to the sign-in page after sign-out
    } catch (error) {
      console.error('Sign-out error:', error); // Handle any errors
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
      <View className="p-2 bg-white rounded-lg flex-row justify-center items-center">
        <FontAwesome name="sign-out" size={20} color="gray" className="mr-2"/>
        <Text className="text-red-500 text-lg" style={{fontFamily: "MontserratRegular"}}>
          Sign out
        </Text>
      </View>
    </TouchableOpacity>
  );
}
