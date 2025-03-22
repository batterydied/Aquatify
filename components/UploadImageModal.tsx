import { Modal, View } from "react-native";

const UploadImageModal = ({visible, onClose} : 
    {visible: boolean, onClose: (val: boolean)=>void})=>{
    return (
        <Modal visible={visible}>
            <View>
                
            </View>
        </Modal>
    )
}

export default UploadImageModal;