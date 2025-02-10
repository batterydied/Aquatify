import { FontAwesome } from "@expo/vector-icons"
import { Modal, View, Text, TouchableOpacity } from "react-native"

const DescriptionModal = ({visible, description, setter} : {visible: boolean, description: string, setter: (state: boolean)=>void}) => {
    return (
        <Modal animationType="slide" visible={visible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="flex justify-center items-center bg-gray-200 h-[50%] w-[90%] rounded-md">
                    <Text style={{fontFamily: "MontserratRegular"}}>
                        {description}
                    </Text>
                </View>
                <TouchableOpacity className="mt-4" activeOpacity={0.7} onPress={()=>setter(false)}>
                    <FontAwesome name="times" size={45} color="#454545"/>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default DescriptionModal