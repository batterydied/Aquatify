import { View, Text, Pressable } from "react-native"
interface LoginProps {
    login: () => void; // This is the function that will be passed from the parent component
  }

export default function LoginPage({ login }: LoginProps){
    return(
        <View>
            <Pressable onPress={ login }>
                <Text>
                    Sign in here
                </Text>
            </Pressable>
        </View>
    )
}