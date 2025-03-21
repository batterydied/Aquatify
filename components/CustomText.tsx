import { Text } from 'react-native'
const CustomText = ({style, text, isBold = false}:{style?: object, text: string, isBold?: boolean})=>{
    return (
        <Text style={{
            ...style,
            fontFamily: isBold? "MontserratBold" : "MontserratRegular"
        }}>
            {text}
        </Text>
    )
}

export default CustomText