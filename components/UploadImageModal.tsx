import { Modal, View, Text } from "react-native";
import BackArrow from "./BackArrow";
import { uploadImage } from "@/lib/imageUpload";
import CustomButton from "./CustomButton";
import { uploadImage as uploadImageAPI } from "../lib/apiCalls";

const UploadImageModal = ({visible, onClose, imageURIs, setImageURIs} : 
    {visible: boolean, onClose: ()=>void, imageURIs: string[], setImageURIs: (vals: string[])=> void})=>{
    const saveImage = async (val:string)=>{
        const res = await uploadImageAPI(null, val);
        setImageURIs([...imageURIs, res]);
    }
    const renderImage = (imageURI: string)=>{
        return (
            <View key={imageURI}>
                <Text>
                    
                </Text>
            </View>
        )
    }
    return (
        <Modal visible={visible}>
            <View style={{flex:1, marginTop: 64}}>
                <BackArrow handleBack={onClose} />
                <View style={{padding: 16}}>
                    <CustomButton title="Select images" onPress={()=>uploadImage("gallery", saveImage)}/>
                </View>
                {imageURIs.map((imageURI: string)=>renderImage(imageURI))}
            </View>
        </Modal>
    )
}

export default UploadImageModal;