import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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
    if (!email) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
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
        router.push('/sign-in'); // Navigate back to the sign-in page
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
    <View className="flex-1 justify-center items-center p-4">
        <Image className="w-[40%] h-[20%]" source={require('../../assets/images/aquatify-logo-no-bg.png')} />
      <Text className="text-2xl font-bold mb-4 text-center" style={{fontFamily: "MontserratRegular"}}>Forgot Password?</Text>
      {!successfulCreation ? (
        <>
          <TextInput
            className= "text-black mb-2 p-2 border-gray-300 border-[1px] rounded-2xl w-[80%]"
            placeholder="Enter your email"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{fontFamily: "MontserratRegular"}}
          />
          <TouchableOpacity
            className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl" 
            onPress={create}
          >
            <Text className="text-white text-center" style={{fontFamily: "MontserratRegular"}}>Send Reset Code</Text>
          </TouchableOpacity>
          {error ? <Text className="text-red-500 text-center mt-2">{error}</Text> : null}
        </>
      ) : (
        <>
          <TextInput
            className="text-black mb-2 p-2 border-gray-300 border-[1px] rounded-2xl w-[80%]"
            placeholder="Enter new password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{fontFamily: "MontserratRegular"}}
          />
          <TextInput
            className="text-black mb-2 p-2 border-gray-300 border-[1px] rounded-2xl w-[80%]"
            placeholder="Enter reset code"
            placeholderTextColor="gray"
            value={code}
            onChangeText={setCode}
            style={{fontFamily: "MontserratRegular"}}
          />
          <TouchableOpacity
            className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl" 
            onPress={reset}
          >
            <Text className="text-white text-center">Reset Password</Text>
          </TouchableOpacity>
          {error ? <Text className="text-red-500 text-center mt-2">{error}</Text> : null}
        </>
      )}
    </View>
  );
}
