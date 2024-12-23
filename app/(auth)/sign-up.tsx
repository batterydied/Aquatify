import * as React from 'react'
import { Text, TextInput, View, TouchableOpacity, Image } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignOutPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('') // State to hold error message

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Reset the error message before trying to sign up
    setErrorMessage('')

    try {
      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      // Set error message based on the error
      setErrorMessage(err.message || 'An error occurred during sign-up')
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // Handle any errors during verification
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="pb-2" style={{fontFamily: "MontserratRegular"}}>Verify your email</Text>
        <TextInput
        className="text-black mb-2 p-2 border-gray-300 border-[1px] rounded-2xl w-[80%]"
        placeholder="Enter your verification code"
        placeholderTextColor="gray"
        value={code}
        onChangeText={(code) => setCode(code)}
        style={{fontFamily: "MontserratRegular"}}
        />
        <TouchableOpacity
        className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl"
        onPress={onVerifyPress}>
            <Text className="text-white" style={{fontFamily:"MontserratRegular"}}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center items-center">  
        <Image className="w-[40%] h-[20%]" source={require('../../assets/images/aquatify-logo-no-bg.png')} />
        <TextInput
            className="text-black mb-2 p-2 border-gray-300 border-[1px] rounded-2xl w-[80%]"
            placeholder="Enter your email"
            placeholderTextColor="gray"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={{fontFamily: "MontserratRegular"}}
        />
        <TextInput
            className="text-black p-2 border-gray-300 border-[1px] rounded-2xl w-[80%] mb-4"
            placeholderTextColor="gray"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{fontFamily: "MontserratRegular"}}
        />
        {errorMessage && (
            <Text className="text-red-500" style={{fontFamily:"MontserratRegular"}}>{errorMessage}</Text> // Display error message in red
        )}
        <TouchableOpacity
            className="bg-c3 w-[80%] flex justify-center items-center p-2 m-2 rounded-xl"
            onPress={onSignUpPress}
        >
            <Text className="text-white" style={{fontFamily:"MontserratRegular"}}>Continue</Text>
        </TouchableOpacity>
        <Text className="m-2 text-center w-full" style={{fontFamily: "MontserratRegular"}}>
            Have an account? {''}
            <Text
            className="t-c3"
            style={{fontFamily: "MontserratRegular"}}
            onPress={() => router.push('/sign-in')}
            >
            Sign in
            </Text>
        </Text>
    </View>
  )
}
