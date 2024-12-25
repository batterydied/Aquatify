import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
export default function ProductPage(){
    const router = useRouter();
    return (
        <View className='flex-1 justify-center items-center bg-white'>
            <TouchableOpacity onPress={()=>{
                console.log('pressed');
                router.back()}}>
            <Text>
                Go back
            </Text>
            </TouchableOpacity>
        </View>
    )
}