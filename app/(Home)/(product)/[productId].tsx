import { View, Text, TouchableOpacity, Image, Dimensions, FlatList, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { fetchProductById, productInterface, review } from '../../../lib/utils'; // Update path to your utility functions

export default function ProductPage() {
    const router = useRouter();
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [product, setProduct] = useState<productInterface | null>(null);
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth * 0.8; // Set image width to 80% of screen width
    const [orientation, setOrientation] = useState('portrait');
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchProductData = async () => {
            const productData = await fetchProductById(productId);
            if (productData) {
                setProduct(productData);
            }
        };
        fetchProductData();
    }, [productId]);

    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            if (width > height) {
                setOrientation('landscape');
            } else {
                setOrientation('portrait');
            }
        };

        const subscription = Dimensions.addEventListener('change', updateOrientation);

        updateOrientation();

        return () => {
            subscription.remove();
        };
    }, []);

    if (!product) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    const renderHeader = () => (
        <View className="flex-1 items-center">
            {/* Product Images */}
            <FlatList
                data={product.images}
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
                style={{width: imageWidth}}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />

            {/* Custom Animated Scroll Indicator */}
            <View
                className="flex-row justify-center mt-4"
            >
                {product.images.map((_, index) => {
                    const dotOpacity = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * screenWidth,
                            index * screenWidth,
                            (index + 1) * screenWidth,
                        ],
                        outputRange: [0.1, 1, 0.1],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            className="h-3 w-3 mx-2 bg-black rounded-xl"
                            style={{
                                opacity: dotOpacity,
                            }}
                        />
                    );
                })}
            </View>

            {/* Product Details */}
            <Text className="mt-16 text-2xl font-bold mb-2">{product.name}</Text>
            <Text className="text-lg text-gray-600 mb-4">{product.secondaryName}</Text>
            <Text className="text-xl font-bold mb-4">${product.productTypes[0].price}</Text>
            <Text className="text-base mb-4">{product.description}</Text>

            {/* Reviews Section Header */}
            <Text className="text-xl font-bold mb-2">Reviews</Text>
        </View>
    );

    const renderReview = ({ item }: { item: review }) => (
        <View className="mb-4">
            <Text className="font-semibold">{item.user}</Text>
            <Text className="text-yellow-500">{item.rating} Stars</Text>
            <Text className="italic">{item.comment}</Text>
        </View>
    );

    return (
        <View className="p-5 bg-c3">
            <FlatList
                key={orientation}
                className="mt-16"
                data={product.reviews}
                renderItem={renderReview}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    <TouchableOpacity
                        className="mt-4 py-3 px-6 bg-blue-500 rounded-lg"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white text-lg">Go Back</Text>
                    </TouchableOpacity>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
