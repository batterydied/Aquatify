import { image, productInterface } from "@/lib/interface";
import { FlatList, View, Image, Animated } from "react-native";

const ProductImageFlatlist = ({images, imageWidth, width, product, scrollX}:{images: image[], imageWidth: number, width: number, product: productInterface, scrollX: Animated.Value})=>{
    return (
        <View>
            <FlatList
            data={images}
            renderItem={({ item, index }) => (
                <Image
                key={index} // This will ensure each image has a unique key
                source={{ uri: item.url }}
                style={{ width: imageWidth, height: imageWidth }} // Add a style for the image
                className="rounded-lg"
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
            {product.images.map((_, index) => {
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
                    className="h-2 w-2 mx-2 bg-black rounded-xl mb-2"
                    style={{
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