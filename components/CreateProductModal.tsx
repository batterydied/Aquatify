import { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import CategoryDropdown from './MultiSelectDropdown';
import RoundedTextInput from './RoundedTextInput';
import { categoryTypes } from '@/lib/interface';

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
            <View style={styles.container}>
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
                <CategoryDropdown selected={selectedCategories} setSelected= {setSelectedCategories} placeholder="Select categories" data={categoryTypes}/>

                <View style={styles.buttonContainer}>
                    <Button title="Cancel" onPress={onClose} />
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </View>
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
        justifyContent: 'space-between',
        marginTop: 16,
    },
});

export default CreateProductModal;