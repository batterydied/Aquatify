import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { isSignedIn, isLoaded } = useUser(); // Check if the user is signed in and if data is loaded
  const router = useRouter(); // Access the router for navigation
  
  // Initialize loading state
  const [loading, setLoading] = useState(true);

  useWarmUpBrowser();
  // Wait for the user context to be loaded before checking sign-in status
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]); // Run once isLoaded changes

  // Effect for handling navigation
  useEffect(() => {
    if (!loading) {
      if (isSignedIn) {
        router.push('/(tabs)/home');
      } else {
        router.push('/(auth)/sign-in');
      }
    }
  }, [isSignedIn, loading, router]); // Run this effect only after loading is complete

  if (loading) {
    // While loading, show loading state (or a spinner)
    return <Text>Loading...</Text>;
  }

  return null; // Nothing is rendered after loading and routing
}
