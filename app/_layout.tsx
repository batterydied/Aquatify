import "../global.css";
import { Stack } from 'expo-router';
export default function RootLayout(){
    return (
        <Stack screenOptions={{
        }}>
            <Stack.Screen name="(Home)"  />
            <Stack.Screen name="(Product)"  />
        </Stack>
    )   
}
