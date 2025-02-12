import { View, Text } from "react-native"

const ErrorText = ({message, style}: {message: string, style?: object}) => {
    return (
        <View>
            <Text style={[{
                color: "#991b1b",
                fontFamily: "MontserratRegular"
            }, style]}>
                {message}
            </Text>
        </View>
    )
}

export default ErrorText;