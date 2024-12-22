import React from 'react'; // Add this import
import { useClerk } from '@clerk/clerk-expo'; // Import useClerk from @clerk/clerk-expo
import { Button } from 'react-native'; // Basic React Native components
import { useRouter } from 'expo-router'; // Import useRouter for navigation

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
      <Button title="Sign Out" onPress={handleSignOut} />
  );
}
