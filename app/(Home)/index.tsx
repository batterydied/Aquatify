import { View, Text } from "react-native";
import { Link } from 'expo-router';
export default function App(){
    return (
        <View className="flex-1 justify-center items-center">
            <Link href="../(Product)/TestPage">
                <Text className="text-red-500">Hello from index</Text>
            </Link>
        </View>
      );      
}
