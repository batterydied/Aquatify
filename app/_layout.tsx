import "../global.css";
import { tokenCache } from '@/cache';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { Slot } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from "@/contexts/UserContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <StatusBar style="dark" />
        <UserProvider>
          <Slot />
        </UserProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
