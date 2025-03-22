import { useState } from "react";
import { Modal, View } from "react-native"
import ErrorText from "./ErrorText";
import RoundedTextInput from "./RoundedTextInput";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import { initProductType } from "@/lib/interface";
import BackArrow from "./BackArrow";
import { validatePricing, validateQuantity } from "@/lib/validation";

const EditProductTypeModal = ({initProductTypes, setInitProductTypes, isEditingProductType, setIsEditingProductType, val} : 
    {initProductTypes: initProductType[], setInitProductTypes: (vals: initProductType[])=>void, isEditingProductType: boolean, setIsEditingProductType: (value: boolean)=>void, val: initProductType})=>{
    const [name, setName] = useState<string>(val.type);
    const [originalName, setOriginalName] = useState<string>(val.type);
    const [price, setPrice] = useState<string>(val.price.toString());
    const [quantity, setQuantity] = useState<string>(val.quantity.toString());
    const [error, setError] = useState(
        {
            isNameValid: true,
            isPriceValid: true,
            isQuantityValid: true,
            doNotHaveDuplicatedName: true
        }
    );

    const checkDoNotHaveDuplicateName = (vals: initProductType[], name: string)=>{
        return !vals.some((val)=>(val.type === name))
    }

    const handleUpdate = ()=>{
        const isNameValid = name !== "";
        const newError = {
            isNameValid,
            isPriceValid: validatePricing(price), 
            isQuantityValid: validateQuantity(quantity), 
            doNotHaveDuplicatedName: name == originalName ? true : isNameValid ? checkDoNotHaveDuplicateName(initProductTypes, name) : true
        }
        
        setError(newError);

        const hasErrors = Object.values(newError).some((isValid) => !isValid);

        if(!hasErrors){
            const newInitProductTypes = initProductTypes.map((val)=>{
                if(val.type === originalName){
                    return {price: parseInt(price), type: name, quantity: parseInt(quantity)};
                }else{
                    return val;
                }
            })
            setInitProductTypes(newInitProductTypes);
            setIsEditingProductType(false);
        }
    }

    const handleDelete = ()=>{
        const newInitProductTypes = initProductTypes.filter(val => val.type !== originalName)
        setInitProductTypes(newInitProductTypes);
        setIsEditingProductType(false)
    }

    return (
        <Modal visible={isEditingProductType}>
            <View style={{flex: 1, padding: 16, marginTop: 32}}>
                <BackArrow handleBack={()=>setIsEditingProductType(false)} />
                <View style={{flex: 1, justifyContent: "center", marginTop: -32}}>
                    <View>
                        <CustomText text="Edit product type" style={{fontSize: 18, textAlign: "center", marginBottom: 8}}/>
                        <RoundedTextInput value={name} setValue={setName} placeholder="Enter product type here" clearValue={()=>setName("")}/>
                        {!error.isNameValid && <ErrorText message="You can't leave the product name blank." style={{paddingHorizontal: 8}}/>}
                        {!error.doNotHaveDuplicatedName && <ErrorText message="You can't have the same product type name." style={{paddingHorizontal: 8}}/>}
                        <RoundedTextInput value={price} setValue={setPrice} placeholder="Enter pricing here" clearValue={()=>setPrice("")}/>
                        {!error.isPriceValid && <ErrorText message="Please enter a valid pricing." style={{paddingHorizontal: 8}}/>}
                        <RoundedTextInput value={quantity} setValue={setQuantity} placeholder="Enter quantity here" clearValue={()=>setQuantity("")}/>
                        {!error.isQuantityValid && <ErrorText message="Please enter a valid quantity." style={{paddingHorizontal: 8}}/>}
                        <CustomButton title="Update" onPress={handleUpdate} color="white"
                        style={{
                            backgroundColor: "#60a5fa",
                            margin: 8
                        }}
                        />
                        <CustomButton title="DELETE" onPress={handleDelete} color="white"
                        style={{
                            backgroundColor: "#DC2626",
                            margin: 8
                        }}
                        isBold={true}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default EditProductTypeModal