import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const UploadImageOptionModal = ({
  visible, 
  onClose, 
  onUpload, 
  onRemove,
  haveRemove=false
} : {
  visible: boolean, 
  onClose: () => void, 
  onUpload: (source: "camera" | "gallery") => void,
  onRemove?: () => void,
  haveRemove?: boolean
}) => {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View className="bg-white flex-col justify-center items-center p-4 rounded-md"
             onStartShouldSetResponder={() => true}>
              <Text className="text-black text-2xl" style={{ fontFamily: "MontserratBold" }}>
                Upload photo
              </Text>

              <View className="flex-row">
                <OptionButton icon="camera" label="Camera" onPress={() => onUpload("camera")} />
                <OptionButton icon="image" label="Gallery" onPress={() => onUpload("gallery")} />
                {haveRemove && onRemove && <OptionButton icon="trash" label="Remove" onPress={onRemove} />}
              </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Reusable button inside the modal
const OptionButton = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="w-[25%]">
    <View className="p-2 m-2 bg-gray-200 flex justify-center items-center rounded-md">
      <FontAwesome name={icon} size={20} color="gray" />
      <Text style={{ fontFamily: "MontserratRegular" }}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default UploadImageOptionModal;
