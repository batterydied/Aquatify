import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"

const BackArrow = ({handleBack, style} : {handleBack: ()=>void, style?: object})=>{
    return (
        <View style={style}>
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            >
                <FontAwesome
                name="arrow-left"
                size={20}
                color="gray"
                className="ml-4"
                />
            </TouchableOpacity>
        </View>
    )

}
export default BackArrow