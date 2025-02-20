import { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import CategoryDropdown from './MultiSelectDropdown';
import RoundedTextInput from './RoundedTextInput';
import { categoryTypes, productType } from '@/lib/interface';
import EditableDescription from './EditableDescription';
import CreateProductTypeModal from './CreateProductTypeModal';
import BackArrow from './BackArrow';
import CustomButton from './CustomButton';

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
    const [productTypes, setProductTypes] = useState<productType[]>([]);
    const [isCreatingProductType, setIsCreatingProductType] = useState(false);

    const handleSubmit = () => {
        const newProduct = {
            name,
            secondaryName,
            categories: selectedCategories,
            description,
        };
        onSubmit(newProduct);
        onClose();
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
                        <View>
                            <Text style={{
                                fontFamily: "MontserratRegular",
                                color: "#3b82f6"
                            }}
                            >
                                Add a product type
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <CreateProductTypeModal visible={isCreatingProductType} onClose={()=>setIsCreatingProductType(false)} />
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