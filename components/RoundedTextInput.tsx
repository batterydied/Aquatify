import { FontAwesome } from "@expo/vector-icons"
import { TextInput, TouchableOpacity, View } from "react-native"

const RoundedTextInput = ({
    value, 
    setValue, 
    clearValue, 
    placeholder, 
    style, 
    maxLength
}: {
    value: string, 
    setValue: (newValue: string)=>void, 
    clearValue: ()=>void, 
    placeholder: string, 
    style?: object, 
    maxLength?: number
})=>{
    return (
        <View className="flex-row items-center border border-gray-500 py-1 px-2 m-2 rounded-xl justify-between" style={style}>
            <TextInput 
            value={value} 
            onChangeText={setValue} 
            className="flex-1" 
            style={{ fontFamily: "MontserratRegular" }}
            placeholder={placeholder}
            placeholderTextColor={"gray"}
            maxLength={maxLength}/>
            <TouchableOpacity onPress={clearValue} activeOpacity={0.7}>
                <FontAwesome name="times-circle" color="gray" size={25} />
            </TouchableOpacity>
        </View>
    )
}

export default RoundedTextInput;