import { View, Image, Text } from "react-native";

const ProfilePicture = ({ 
    imageUri, 
    imageWidth, 
    name, 
    style 
}: {
    imageUri: string | null, 
    imageWidth: number, 
    name: string, 
    style?: object
})=> {
  return (
         <View className="p-4" style={style}>
            <Image
                className="rounded-full border-2 border-gray-400"
                style={{
                    width: imageWidth,
                    height: imageWidth,
                }}
                resizeMode="cover"
                source={
                    imageUri
                        ? { uri: imageUri }
                        : require('../assets/images/default-avatar-icon.png')
                }
            />
            <Text style={{ fontFamily: "MontserratRegular" }} className="text-lg m-2">
                {name}
            </Text>
        </View>
  );
};

export default ProfilePicture;
