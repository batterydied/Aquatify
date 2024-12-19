import { View, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import LoginPage from "./Login";

export default function Index(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        // After successful login, navigate to the home page or dashboard
        router.push('/(tabs)/Home');
    };
    
    return (
        <View>
          {!isLoggedIn && <LoginPage login={handleLoginSuccess}/>}
        </View>
      );      
}