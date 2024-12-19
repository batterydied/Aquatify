import { useLocalSearchParams } from "expo-router";
import {View, Text} from "react-native";
export default function ProductPage(){
    const { productId } = useLocalSearchParams<{productId: string}>();
    return( 
    <View>
        <Text>Product Page for Id: {productId}</Text>
    </View>
    )
}