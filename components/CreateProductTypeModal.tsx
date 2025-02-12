import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback, Keyboard } from "react-native"
import RoundedTextInput from "./RoundedTextInput"
import { useState } from "react";
import BackArrow from "./BackArrow";
import CustomButton from "./CustomButton";
import { validateQuantity, validatePricing } from "@/lib/validation";
import ErrorText from "./ErrorText";

const CreateProductTypeModal = ({visible, onClose}: {visible: boolean, onClose: (state:boolean)=>void}) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("")
    const [error, setError] = useState(
        {
            isNameValid: true,
            isPriceValid: true,
            isQuantityValid: true
        }
    )

    const handleSubmit = ()=>{
        const newError = {
            isNameValid: name !== "", 
            isPriceValid: validatePricing(price), 
            isQuantityValid: validateQuantity(quantity), 
        };
        
        setError(newError);

        const hasErrors = Object.values(newError).some((isValid) => !isValid);

        if(!hasErrors){

        }
    }

    return (
        <Modal visible={visible}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <BackArrow handleBack={()=>onClose(false)}/>
                    <Text style={styles.title}>
                        Create Product Type
                    </Text>
                    <RoundedTextInput value={name} setValue={setName} placeholder="Enter product type here" clearValue={()=>setName("")}/>
                    {!error.isNameValid && <ErrorText message="You can't leave the product name blank." style={{paddingHorizontal: 8}}/>}
                    <RoundedTextInput value={price} setValue={setPrice} placeholder="Enter pricing here" clearValue={()=>setPrice("")}/>
                    {!error.isPriceValid && <ErrorText message="Please enter a valid pricing." style={{paddingHorizontal: 8}}/>}
                    <RoundedTextInput value={quantity} setValue={setQuantity} placeholder="Enter quantity here" clearValue={()=>setPrice("")}/>
                    {!error.isQuantityValid && <ErrorText message="Please enter a valid quantity." style={{paddingHorizontal: 8}}/>}
                    <CustomButton title="Submit" onPress={handleSubmit} color="white"
                    style={{
                        backgroundColor: "#60a5fa",
                        margin: 8
                    }}
                    />
                </View>
            </TouchableWithoutFeedback>
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
        marginVertical: 16
    }
})

export default CreateProductTypeModal;
