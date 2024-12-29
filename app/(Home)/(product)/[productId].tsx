import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchProductById, productInterface } from '../../../lib/utils'; // Update path to your utility functions
import Swiper from 'react-native-swiper';

// ProductPage Component
export default function ProductPage() {
    const router = useRouter();
    const { productId } = useLocalSearchParams<{ productId: string }>(); // Get productId from route params
    const [product, setProduct] = useState<productInterface | null>(null);

    // Fetch product and seller data on mount
    useEffect(() => {
        const fetchProductData = async () => {
            const productData = await fetchProductById(productId);
            if (productData) {
                setProduct(productData);
            }
        };
        fetchProductData();
    }, [productId]);

    if (!product) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5 bg-c3">
            <Text className="mt-16 text-2xl font-bold mb-2">{product.name}</Text>
            <Text className="text-lg text-gray-600 mb-4">{product.secondaryName}</Text>
            <Text className="text-xl font-bold mb-4">${product.productTypes[0].price}</Text>

            {/* Product Images */}
            <Swiper
                showsPagination={true}  // Optional: To show dots for pagination
                autoplay={true} // Optional: Auto scroll if desired
            >
                {product.images.map((item) => (
                    <View key={item.id} className="items-center justify-center">
                        <Image source={{ uri: item.url }} className="w-80 h-80 rounded-lg" />
                    </View>
                ))}
            </Swiper>
            <Text className="text-base mb-4">{product.description}</Text>

            {/* Reviews Section */}
            <Text className="text-xl font-bold mb-2">Reviews</Text>
            <FlatList
                data={product.reviews}
                renderItem={({ item }) => (
                    <View className="mb-4">
                        <Text className="font-semibold">{item.user}</Text>
                        <Text className="text-yellow-500">{item.rating} Stars</Text>
                        <Text className="italic">{item.comment}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Seller Name */}
            <Text className="text-lg font-semibold mt-4">Seller: {product.sellerName}</Text>

            {/* Go Back Button */}
            <TouchableOpacity
                className="mt-4 py-3 px-6 bg-blue-500 rounded-lg"
                onPress={() => router.back()}
            >
                <Text className="text-white text-lg">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}