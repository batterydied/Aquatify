import { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import CategoryDropdown from './MultiSelectDropdown';
import RoundedTextInput from './RoundedTextInput';
import { categoryTypes, image, initProductType, productInterface } from '@/lib/interface';
import EditableDescription from './EditableDescription';
import ProductTypeModal from './ProductTypeModal';
import BackArrow from './BackArrow';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import ErrorText from './ErrorText';
import { FontAwesome } from '@expo/vector-icons';
import UploadImageModal from './UploadImageModal';

const UpdateProductModal = ({
    visible, 
    onClose, 
    onSubmit,
    product
}: {
    visible: boolean, 
    onClose: () => void, 
    onSubmit: (productId: string, product: any) => void,
    product: productInterface
}) => {
    const [name, setName] = useState(product.name);
    const [secondaryName, setSecondaryName] = useState(product.secondaryName);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categories);
    const [description, setDescription] = useState(product.description);
    const [initProductTypes, setInitProductTypes] = useState<initProductType[]>(product.productTypes);
    const [isCreatingProductType, setIsCreatingProductType] = useState(false);
    const [productTypeError, setProductTypeError] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [images, setImages] = useState<image[]>(product.images);

    const handleSubmit = () => {
        if(initProductTypes.length < 1){
            setProductTypeError(true);
        }else{
            const updatedProduct = {
                name,
                secondaryName,
                categories: selectedCategories,
                description,
                productTypes: initProductTypes,
                images: images.map((img)=>img.url),
            };
            onSubmit(product.productId, updatedProduct);
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
        setImages([]);
    };

    return (
        <Modal visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{marginTop: 64}}>
                    <BackArrow handleBack={onClose}/>
                    <View style={{padding: 16}}>
                        <Text style={styles.title}>Update Product</Text>
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
                        <UploadImageModal visible={isUploadingImage} onClose={()=>setIsUploadingImage(false)} images={images} setImages={setImages}/>
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
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 8
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

export default UpdateProductModal;