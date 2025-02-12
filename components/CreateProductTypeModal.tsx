import { View, StyleSheet, Modal, Text } from "react-native"
import RoundedTextInput from "./RoundedTextInput"
import { useState } from "react";
import BackArrow from "./BackArrow";

const CreateProductTypeModal = ({visible, onClose}: {visible: boolean, onClose: (state:boolean)=>void}) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("")
    const [isNameValid, setIsNameValid] = useState(false);
    const [isPriceValid, setIsPriceValid] = useState(false);
    const [isQuantityValid, setIsQuantityValid] = useState(false);
    return (
        <Modal visible={visible}>
            <View style={styles.container}>
                <BackArrow handleBack={()=>onClose(false)}/>
                <Text style={styles.title}>
                    Create Product Type
                </Text>
                <RoundedTextInput value={name} setValue={setName} placeholder="Enter product type here" clearValue={()=>setName("")}/>
                <RoundedTextInput value={price} setValue={setPrice} placeholder="Enter pricing here" clearValue={()=>setPrice("")}/>
                <RoundedTextInput value={quantity} setValue={setQuantity} placeholder="Enter quantity here" clearValue={()=>setPrice("")}/>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 16

    }
})

export default CreateProductTypeModal;
