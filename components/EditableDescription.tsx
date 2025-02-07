import { TextInput } from "react-native"

const EditableDescription = ({value, setValue, style, placeholder, maxLength} : {value: string, setValue: (description: string)=>void, style?: object, placeholder: string, maxLength?: number})=>{
    return (
        <TextInput 
        value={value}
        className="text-black border p-2 rounded-md border-gray-500"
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        style={{ fontFamily: "MontserratRegular", ...style }}
        onChangeText={setValue}
        multiline={true}
        maxLength={maxLength}
        />
    )
}

export default EditableDescription;