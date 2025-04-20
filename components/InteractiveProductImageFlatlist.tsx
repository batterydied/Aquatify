import { BASE_URL } from "@/lib/apiCalls";
import { image } from "@/lib/interface";
import { FlatList, View, Image, Animated, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { extractFilenameAndDelete } from "@/lib/apiCalls";

const InteractiveProductImageFlatlist = ({setImages, images, imageWidth, width, scrollX}:{setImages: (vals: image[])=> void, images: image[], imageWidth: number, width: number, scrollX: Animated.Value})=>{
    return (
        <View style={{flexDirection: "column", alignItems: "center"}}>
            <FlatList
            data={images}
            renderItem={({ item, index }) => (
                <View
                key={index}
                >
                    <Image
                    source={{ uri: BASE_URL + item.url }}
                    style={{ width: imageWidth, height: imageWidth }} // Add a style for the image
                    className="rounded-lg"
                    />
                    <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        padding: 8
                    }}
                    onPress={()=>{
                        extractFilenameAndDelete(item.url)
                        setImages(images.filter(img => img.url !== item.url))
                        }}>
                        <CustomText style={{fontSize: 16}}text="Delete" />
                    </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item) => item.id.toString()} // Ensures each item has a unique key (item.id)
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            style={{ width: imageWidth }}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
            )}
            />
            {/* Custom Animated Scroll Indicator */}
            <View className="flex-row justify-center mt-4">
            {images.map((_, index) => {
                const dotOpacity = scrollX.interpolate({
                inputRange: [
                    (index - 1) * width, // Previous page
                    index * width, // Current page
                    (index + 1) * width, // Next page
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp", // Ensures values stay in the range [0.3, 1, 0.3]
                });

                return (
                <Animated.View
                    key={index}
                    style={{
                      height: 8,
                      width: 8,
                      marginHorizontal: 4,
                      marginBottom: 8,
                      borderRadius: 4,
                      backgroundColor: 'black',
                      opacity: dotOpacity,
                    }}
                />
                );
            })}
            </View>
        </View>
    )

}

export default InteractiveProductImageFlatlist