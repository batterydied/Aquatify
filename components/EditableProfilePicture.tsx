import { View, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const EditableProfilePicture = ({
  imageUri, 
  imageWidth, 
  setEdit, 
  style
} : {
  imageUri: string | null, 
  imageWidth: number, 
  setEdit: (state: boolean)=>void, 
  style? : object
}) => {
  return (
    <View className="m-3 relative" style={style}>
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
            : require("../assets/images/default-avatar-icon.png")
        }
      />

      {/* Edit Icon */}
      <TouchableOpacity
        className="absolute"
        style={{
          top: imageWidth - 35,
          left: imageWidth - 35,
        }}
        activeOpacity={0.7}
        onPress={()=>setEdit(true)}
      >
        <View className="p-2 rounded-full" style={{
            backgroundColor: '#f3f4f6'
        }}>
          <FontAwesome name="camera" size={20} color="gray" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EditableProfilePicture;
