import { Modal, View, Image, useWindowDimensions, Animated } from "react-native";
import BackArrow from "./BackArrow";
import { uploadImage } from "@/lib/imageUpload";
import CustomButton from "./CustomButton";
import { BASE_URL, uploadImage as uploadImageAPI } from "../lib/apiCalls";
import InteractiveProductImageFlatlist from "./InteractiveProductImageFlatlist";
import { image } from "@/lib/interface";
import { useRef } from "react";

const UploadImageModal = ({visible, onClose, images, setImages} : 
    {visible: boolean, onClose: ()=>void, images: image[], setImages: (vals: image[])=> void})=>{
    const {width} = useWindowDimensions();
    let imageWidth = width > 600 ? width * 0.4 : width * 0.8; // Set image width to 80% of screen width
    const scrollX = useRef(new Animated.Value(0)).current;
    const saveImage = async (val:string)=>{
        const res = await uploadImageAPI(null, val);
        setImages([...images, {id: res, url: res}]);
    }
    return (
        <Modal visible={visible}>
            <View style={{flex:1, marginTop: 64}}>
                <BackArrow handleBack={onClose} />
                <View style={{padding: 16}}>
                    <CustomButton size={16} title="Select images" onPress={()=>{uploadImage("gallery", saveImage)}}/>
                </View>
                <InteractiveProductImageFlatlist setImages={setImages} images={images} imageWidth={imageWidth} width={width} scrollX={scrollX}/>
            </View>
        </Modal>
    )
}

export default UploadImageModal;