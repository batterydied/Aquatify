import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useSignIn,  useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';


export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      // Warm up the android browser to improve UX
      // https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }, [])
}


WebBrowser.maybeCompleteAuthSession();

export default function SignInPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

    useWarmUpBrowser();

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/dashboard', { scheme: 'aquatify' }),
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {
                setActive!({ session: createdSessionId })
            } else {
                // Use signIn or signUp returned from startOAuthFlow
                // for next steps, such as MFA
            }
        } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        }
    }, [])
    /**
     * Handle email/password sign-in.
     */
    const handleEmailPasswordSignIn = React.useCallback(async () => {
        if (!isLoaded) return

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                Alert.alert('Sign-In Incomplete', 'Please complete additional steps to sign in.')
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
        Alert.alert('Sign-In Error', 'Failed to sign in with email and password.')
        console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password, signIn, setActive, router])

    return (
        <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Sign In</Text>

        {/* Email/Password Sign-In */}
        <TextInput
            style={{ marginBottom: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
        />
        <TextInput
            style={{ marginBottom: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Button title="Sign In" onPress={handleEmailPasswordSignIn} />
        <Button title="Sign In With Google" onPress={onPress} />

        <Text>
            Don’t have an account?{' '}
            <Text
            style={{ color: 'blue' }}
            onPress={() => router.push('/sign-up')}
            >
            Sign up
            </Text>
        </Text>
        </View>
    )
}
