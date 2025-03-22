import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native"
import RoundedTextInput from "./RoundedTextInput"
import { useEffect, useState } from "react";
import BackArrow from "./BackArrow";
import CustomButton from "./CustomButton";
import { validateQuantity, validatePricing } from "@/lib/validation";
import ErrorText from "./ErrorText";
import { initProductType } from "@/lib/interface";
import CustomText from "./CustomText";
import EditProductTypeModal from "./EditProductTypeModal";
import { FontAwesome } from "@expo/vector-icons";

const CreateProductTypeModal = ({visible, onClose, initProductTypes, setInitProductTypes}: {visible: boolean, onClose: ()=>void, initProductTypes: initProductType[], setInitProductTypes: (val: initProductType[])=>void}) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("")
    const [error, setError] = useState(
        {
            isNameValid: true,
            isPriceValid: true,
            isQuantityValid: true,
            doNotHaveDuplicatedName: true
        }
    )
    const [isEditingProductType, setIsEditingProductType] = useState(false);
    const [selectedType, setSelectedType] = useState<initProductType | null>(null);

    const checkDoNotHaveDuplicateName = (vals: initProductType[], name: string)=>{
        return !vals.some((val)=>(val.type === name))
    }
    const handleSubmit = ()=>{
        const isNameValid = name !== "";
        const newError = {
            isNameValid,
            isPriceValid: validatePricing(price), 
            isQuantityValid: validateQuantity(quantity), 
            doNotHaveDuplicatedName: isNameValid ? checkDoNotHaveDuplicateName(initProductTypes, name) : true
        };
        
        setError(newError);

        const hasErrors = Object.values(newError).some((isValid) => !isValid);

        if(!hasErrors){
            setInitProductTypes([...initProductTypes, {price: parseInt(price), type: name, quantity: parseInt(quantity)}]);
            clearValues();
        }
    }

    const renderInitProductType = (val: initProductType)=>{
        return (
            <View key={val.type} style={{flexDirection: "row"}}>
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                    //forcing react to update, it was ignoring the state change
                    setSelectedType(null);
                    setTimeout(() => setSelectedType(val ), 0);
                    setIsEditingProductType(true);
                }}>
                    <CustomText text={val.type} style={{fontSize: 18}}/>
                </TouchableOpacity>
            </View>
        )
    }

    const clearValues = ()=>{
        setName("");
        setPrice("");
        setQuantity("");
        setError(
            {
                isNameValid: true,
                isPriceValid: true,
                isQuantityValid: true,
                doNotHaveDuplicatedName: true
            }
        );
    }
    return (
        <Modal visible={visible}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <BackArrow handleBack={()=>{
                        clearValues();
                        onClose();
                    }}/>
                    <Text style={styles.title}>
                        Product Type Menu
                    </Text>
                    {initProductTypes.map((val: any)=>renderInitProductType(val))}
                    <RoundedTextInput value={name} setValue={setName} placeholder="Enter product type here" clearValue={()=>setName("")}/>
                    {!error.isNameValid && <ErrorText message="You can't leave the product name blank." style={{paddingHorizontal: 8}}/>}
                    {!error.doNotHaveDuplicatedName && <ErrorText message="You can't have the same product type name." style={{paddingHorizontal: 8}}/>}
                    <RoundedTextInput value={price} setValue={setPrice} placeholder="Enter pricing here" clearValue={()=>setPrice("")}/>
                    {!error.isPriceValid && <ErrorText message="Please enter a valid pricing." style={{paddingHorizontal: 8}}/>}
                    <RoundedTextInput value={quantity} setValue={setQuantity} placeholder="Enter quantity here" clearValue={()=>setQuantity("")}/>
                    {!error.isQuantityValid && <ErrorText message="Please enter a valid quantity." style={{paddingHorizontal: 8}}/>}
                    <CustomButton title="Submit" onPress={handleSubmit} color="white"
                    style={{
                        backgroundColor: "#60a5fa",
                        margin: 8
                    }}
                    />
                    {selectedType && <EditProductTypeModal val={selectedType} isEditingProductType={isEditingProductType} setIsEditingProductType={setIsEditingProductType} initProductTypes={initProductTypes} setInitProductTypes={setInitProductTypes}/>}
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
