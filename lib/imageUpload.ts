import * as ImagePicker from "expo-image-picker";

export const uploadImage = async (mode: string, saveImage: (val:string)=> void) => {
    try {
        let result: ImagePicker.ImagePickerResult;

        if (mode === 'gallery') {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                alert('Permission to access the gallery is required!');
                return;
            }

            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        } else {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                alert('Permission to access the camera is required!');
                return;
            }

            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        }

        if (!result.canceled) {
            saveImage(result.assets[0].uri); // Save the new image URI
        }
    } catch (error) {
        console.error(error);
        alert('Error uploading image');
    }
};