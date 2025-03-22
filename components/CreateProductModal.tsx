import { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import CategoryDropdown from './MultiSelectDropdown';
import RoundedTextInput from './RoundedTextInput';
import { categoryTypes, initProductType } from '@/lib/interface';
import EditableDescription from './EditableDescription';
import ProductTypeModal from './ProductTypeModal';
import BackArrow from './BackArrow';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import ErrorText from './ErrorText';
import { FontAwesome } from '@expo/vector-icons';
import UploadImageModal from './UploadImageModal';

const CreateProductModal = ({
    visible, 
    onClose, 
    onSubmit
}: {
    visible: boolean, 
    onClose: () => void, 
    onSubmit: (product: any) => void
}) => {
    const [name, setName] = useState('');
    const [secondaryName, setSecondaryName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [initProductTypes, setInitProductTypes] = useState<initProductType[]>([]);
    const [isCreatingProductType, setIsCreatingProductType] = useState(false);
    const [productTypeError, setProductTypeError] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageURI, setImageURI] = useState<string[]>([]);

    const handleSubmit = () => {
        if(initProductTypes.length < 1){
            setProductTypeError(true);
        }else{
            const newProduct = {
                name,
                secondaryName,
                categories: selectedCategories,
                description,
            };
            onSubmit(newProduct);
            handleReset();
            onClose();
        }
    };

    const handleReset = () => {
        setName('');
        setSecondaryName('');
        setSelectedCategories([]);
        setDescription('');
        setInitProductTypes([]);
        setProductTypeError(false);
    };

    return (
        <Modal visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <BackArrow handleBack={onClose}/>
                    <Text style={styles.title}>Create Product</Text>
                    <RoundedTextInput 
                    value={name}
                    setValue={setName}
                    clearValue={()=>setName("")}
                    maxLength={20}
                    placeholder="Name"
                    />
                    <RoundedTextInput 
                    value={secondaryName}
                    setValue={setSecondaryName}
                    clearValue={()=>setSecondaryName("")}
                    maxLength={20}
                    placeholder="Secondary name"
                    />
                    <EditableDescription value={description} setValue={setDescription} maxLength={200} placeholder="Enter description here" 
                    style={{
                        margin: 8,
                        height: 300
                    }}/>
                    <CategoryDropdown selected={selectedCategories} setSelected= {setSelectedCategories} placeholder="Select categories" data={categoryTypes}/>
                    <TouchableOpacity className="m-2" activeOpacity={0.7} onPress={()=>setIsCreatingProductType(true)}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{
                                fontFamily: "MontserratRegular",
                                color: "#3b82f6",
                                marginRight: 8
                            }}
                            >
                                Add a product type
                            </Text>
                            <CustomText text={`(${initProductTypes.length.toString()})`}/>
                        </View>
                        {productTypeError && <ErrorText message="You need at least one product type added." style={{marginTop: 8}}/>}
                    </TouchableOpacity>
                    <TouchableOpacity className="m-2" activeOpacity={0.7} onPress={()=>setIsUploadingImage(true)}>
                        <View style={{flexDirection: "row", alignContent: "center", backgroundColor: "gray", padding: 8, alignSelf: "flex-start", borderRadius: 12}}>
                            <CustomText text="Upload images" style={{marginRight: 8, color: "white"}} />
                            <FontAwesome name="upload" size={18} color="white"/>
                        </View>
                    </TouchableOpacity>
                    <ProductTypeModal visible={isCreatingProductType} onClose={()=>setIsCreatingProductType(false)} initProductTypes={initProductTypes} setInitProductTypes={setInitProductTypes}/>
                    <UploadImageModal visible={isUploadingImage} onClose={()=>setIsUploadingImage(false)}/>
                    <TouchableOpacity />
                    <CustomButton 
                    title="Submit" 
                    color="white"
                    style={{
                        backgroundColor: "#60a5fa",
                        justifySelf: "center",
                        margin: 8
                    }} 
                    onPress={handleSubmit}
                    />
                      <CustomButton 
                    title="Reset" 
                    color="white"
                    style={{
                        backgroundColor: "#DC2626",
                        justifySelf: "center",
                        margin: 8
                    }} 
                    onPress={handleReset}
                    />
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 32,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 16,
    },
    productTypeContainer: {
        marginBottom: 16,
    },
    productTypeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
});

export default CreateProductModal;