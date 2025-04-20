import { BASE_URL } from "@/lib/apiCalls";
import { image } from "@/lib/interface";
import { FlatList, View, Image, Animated } from "react-native";

const ProductImageFlatlist = ({images, imageWidth, width, scrollX}:{images: image[], imageWidth: number, width: number, scrollX: Animated.Value})=>{
    return (
        <View style={{flexDirection: "column", alignItems: "center"}}>
            <FlatList
            data={images}
            renderItem={({ item, index }) => (
                <Image
                key={index} // This will ensure each image has a unique key
                source={item.url? {uri: BASE_URL + item.url} : require('../assets/images/no-image-icon.png')}
                style={{ width: imageWidth, height: imageWidth, borderRadius: 12, }} // Add a style for the image
                />
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

export default ProductImageFlatlist