import React from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { FontAwesome } from '@expo/vector-icons';

export default function SignInPage() {
    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });

    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const handleGoogleSignIn = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startGoogleOAuthFlow({
                redirectUrl: Linking.createURL('/dashboard', { scheme: 'aquatify' }),
            });

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
            } else {
                // Use signIn or signUp for further steps
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, []);

    const handleEmailPasswordSignIn = React.useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                Alert.alert('Sign-In Incomplete', 'Please complete additional steps to sign in.');
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            Alert.alert('Sign-In Error', 'Failed to sign in with email and password.');
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, emailAddress, password, signIn, setActive, router]);

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className="flex-1 justify-center items-center p-6">
                <Image className="w-[300px] h-[300px]" source={require('../../assets/images/aquatify-logo-no-bg.png')} />
                {/* Email/Password Sign-In */}
                <View className="flex-row items-center border-gray-300 border-[1px] rounded-full w-[80%] mb-4 p-2">
                    <FontAwesome
                    name="user"
                    size={20}
                    color="gray"
                    className="ml-2" // Adds some margin to the left of the icon
                    />
                    <TextInput
                    className="flex-1 text-black ml-2"
                    placeholder="Enter your email"
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    style={{ fontFamily: "MontserratRegular" }}
                    />
                </View>
                <View className="flex-row items-center border-gray-300 border-[1px] rounded-full w-[80%] mb-4 p-2">
                    <FontAwesome
                    name="lock"
                    size={20}
                    color="gray"
                    className="ml-2" // Adds some margin to the left of the icon
                    />
                     <TextInput
                    className="flex-1 text-black ml-2"
                    placeholderTextColor="gray"
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={{ fontFamily: 'MontserratRegular' }}
                    />
                </View>
                <TouchableOpacity
                activeOpacity={0.7} 
                className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-full"
                onPress={handleEmailPasswordSignIn}
                >
                    <Text className="text-white text-center w-full" style={{ fontFamily: 'MontserratRegular' }}>
                        Sign In
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.7} 
                className="bg-c4 w-[80%] flex justify-center items-center p-2 rounded-full"
                onPress={handleGoogleSignIn}
                >
                    <Text className="text-black text-center w-full" style={{ fontFamily: 'MontserratRegular' }}>
                        Sign In With Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/reset-password')}
                >
                    <Text
                    className="w-full m-1 text-center text-gray-500"
                    style={{ fontFamily: 'MontserratRegular' }}
                    >
                        Forgot your password?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/(auth)/sign-up')}>
                    <Text className="m-1 text-center w-full" style={{ fontFamily: 'MontserratRegular' }}>
                        Don’t have an account?{' '}
                        <Text
                        className="t-c3"
                        style={{ fontFamily: 'MontserratRegular' }}
                        >
                            Sign up
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}
