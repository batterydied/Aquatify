import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"

const PlusButton = ({
    size, 
    style, 
    setter
}: {
    size: number, 
    style?: object, 
    setter?: (state:boolean)=>void
}) => {
    return (
        <TouchableOpacity 
        style={style}
        activeOpacity={0.7}
        onPress={()=>{
            if(setter){
                setter(true)
            }
        }}>
            <View className="bg-c2 p-2 flex justify-center items-center" style={{
                borderRadius: "50%",
                width: size,
                height: size,
            }}>
                <FontAwesome name="plus" size={22} color="white" />
            </View>
        </TouchableOpacity>
    )
}

export default PlusButton;
