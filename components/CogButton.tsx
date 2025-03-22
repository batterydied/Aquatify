import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacity, View, StyleSheet} from "react-native"

const CogButton = ({setter, style}: {setter: (state: boolean) => void, style?: object}) => {
    return (
        <View style={{...styles.container, ...style}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setter(true)}>
                <FontAwesome name="cog" color="gray" size={28} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'flex-end',
        position: 'absolute',
        paddingRight: 16,
    },
});

export default CogButton;