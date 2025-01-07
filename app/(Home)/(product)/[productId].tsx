import { View, Text, TouchableOpacity, Image, FlatList, Animated, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { fetchProductById, productInterface, review, productType } from '../../../lib/utils'; // Update path to your utility functions
import DropdownComponent from '../../../components/dropdown';

export default function ProductPage() {
    const router = useRouter();
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [product, setProduct] = useState<productInterface | null>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { width, height } = useWindowDimensions();
    let imageWidth = width > 600 ? width * 0.4 : width * 0.8; // Set image width to 80% of screen width
    const [selectedType, setSelectedType] = useState(product?.productTypes[0] || null);

    useEffect(() => {
        const fetchProductData = async () => {
            const productData = await fetchProductById(productId);
            if (productData) {
                setProduct(productData);
            } 
        };
        fetchProductData();
    }, [productId]);

    // Don't render until dimensions are ready
    if (!product) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-900">
                <ActivityIndicator size="large" color="white" className="mb-4" />
                <Text 
                    className="text-lg text-white" 
                    style={{ fontFamily: "MontserratRegular" }}
                >
                    Loading...
                </Text>
            </View>
        );
    }
 
    const renderHeader = () => (
        
        <View 
            className={ width > 600 ? "flex-row justify-evenly" : "flex-column" }>
            {/* Product Images */}
            <View className="items-center">
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
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [0.1, 1, 0.1],
                            extrapolate: 'clamp',
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
            <View className={width > 600? "w-[50%]" : "w-[100%]"}>
            {/* Product Details */}
                <Text className="text-gray-700" style={{ fontFamily: "MontserratRegular" }}>{product.secondaryName}</Text>
                <Text className="text-xl" style={{ fontFamily: "MontserratBold" }}>{product.name}</Text>

                <View className="w-full h-[1px] bg-gray-600 my-3"></View>
                <DropdownComponent />
                <Text className="text-lg " style={{ fontFamily: "MontserratRegular" }}>${product.productTypes[0].price}</Text>
                <Text className="text-base" style={{ fontFamily: "MontserratRegular" }}>{product.description}</Text>
            </View>
        </View>
    );

    const renderReview = ({ item }: { item: review }) => (
        <View className="mb-4">
            <Text className="font-semibold">{item.user}</Text>
            <Text className="text-yellow-500">{item.rating} Stars</Text>
            <Text className="italic">{item.comment}</Text>
        </View>
    );

    const handleTypeChange = (itemValue: productType) => {
        const selected = product.productTypes.find(type => type.id === itemValue.id) || null;
        setSelectedType(selected);
      };

    return (
        <View className="p-5 bg-c3 flex-1">
            <FlatList
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
