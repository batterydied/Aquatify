import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ForgotPasswordPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  if (!isLoaded) {
    return null; // Show a loading spinner or similar while Clerk is initializing
  }

  const create = async () => {
    if (!emailAddress) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
      setError('');
    } catch (err: any) {
      console.error('Error:', err.errors[0]?.longMessage || err.message);
      setError(err.errors[0]?.longMessage || 'Failed to send reset code.');
    }
  };

  const reset = async () => {
    if (!code || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result?.status === 'complete') {
        Alert.alert('Success', 'Password reset successfully!');
        router.push('/(auth)/sign-in'); // Navigate back to the sign-in page
      } else {
        console.log(result);
        Alert.alert('Error', 'Unexpected status: ' + result?.status);
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0]?.longMessage || err.message);
      setError(err.errors[0]?.longMessage || 'Failed to reset password.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 justify-center items-center p-4">
            <Image className="w-[300px] h-[300px]" source={require('../../assets/images/aquatify-logo-no-bg.png')} />
        <Text className="text-2xl font-bold mb-4 text-center" style={{fontFamily: "MontserratRegular"}}>Forgot Password?</Text>
        {!successfulCreation ? (
            <>
            {/* Email/Password Sign-In */}
            <View className="flex-row items-center border-gray-300 border-[1px] rounded-2xl w-[80%] mb-4 p-2">
                <FontAwesome
                    name="envelope"
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
            <TouchableOpacity
            activeOpacity={0.7} 
            className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl" 
            onPress={create}
            >
                <Text className="text-white text-center" style={{fontFamily: "MontserratRegular"}}>Send Reset Code</Text>
            </TouchableOpacity>
            {error ? <Text className="text-red-700 text-center mt-2">{error}</Text> : null}
            <TouchableOpacity
            onPress={()=>router.push('/(auth)/sign-in')}
            activeOpacity={0.7}
            >
              <Text style={{fontFamily: "MontserratRegular"}} className="text-gray-500"> Back to sign in</Text>
            </TouchableOpacity>
            </>
        ) : (
            <>
            <View className="flex-row items-center border-gray-300 border-[1px] rounded-2xl w-[80%] mb-4 p-2">
                    <FontAwesome
                        name="lock"
                        size={20}
                        color="gray"
                        className="ml-2" // Adds some margin to the left of the icon
                    />
                     <TextInput
                        className="flex-1 text-black ml-2"
                        placeholderTextColor="gray"
                        placeholder="Enter new password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={{ fontFamily: 'MontserratRegular' }}
                    />
            </View>
            <View className="flex-row items-center border-gray-300 border-[1px] rounded-2xl w-[80%] mb-4 p-2">
                <FontAwesome
                        name="key"
                        size={14}
                        color="gray"
                        className="ml-2" // Adds some margin to the left of the icon
                />
                <TextInput
                    className="flex-1 text-black ml-2"
                    placeholder="Enter reset code"
                    placeholderTextColor="gray"
                    value={code}
                    onChangeText={setCode}
                    style={{fontFamily: "MontserratRegular"}}
                />
            </View>
            <TouchableOpacity
            activeOpacity={0.7} 
            className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl" 
            onPress={reset}
            >
                <Text className="text-white text-center">Reset Password</Text>
            </TouchableOpacity>
            {error ? <Text className="text-red-500 text-center mt-2">{error}</Text> : null}
            <TouchableOpacity
            onPress={()=>router.push('/(auth)/sign-in')}
            activeOpacity={0.7}
            >
              <Text style={{fontFamily: "MontserratRegular"}} className="text-gray-500"> Back to sign in</Text>
            </TouchableOpacity>
            </>
        )}
        </View>
    </TouchableWithoutFeedback>
  );
}
