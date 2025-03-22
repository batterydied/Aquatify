import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const CustomButton = ({title, style, color, onPress, size, isBold=false}: {title: string, style?: object, color?: string, onPress: ()=>void, size?: number, isBold?: boolean}) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View style={[styles.container, style]}>
                <Text style={{
                    color: color, 
                    fontFamily: isBold ? "MontserratBold" : "MontserratRegular",
                    fontSize: size
                }}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderRadius: 16,
    }
})
export default CustomButton;