import { Modal, View } from "react-native";
import BackArrow from "./BackArrow";

const UploadImageModal = ({visible, onClose, imageURIs, setImageURIs} : 
    {visible: boolean, onClose: ()=>void, imageURIs: string[], setImageURIs: (vals: string[])=> void})=>{
    return (
        <Modal visible={visible}>
            <View style={{flex:1, marginTop: 64}}>
                <BackArrow handleBack={onClose} />
                <View style={{padding: 16}}>

                </View>
            </View>
        </Modal>
    )
}

export default UploadImageModal;