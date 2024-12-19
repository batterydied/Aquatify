import { Pressable, Text, View } from "react-native";
import { router } from "expo-router"

export default function Index() {
  return (
    <View 
      
    >
      <Text>Hey!</Text>
      <Pressable onPress={handlePress}>
        <Text>
          Press Me
        </Text>
      </Pressable>
    </View>
  );
}

function handlePress(){
  return router.push("/products/2");
}
