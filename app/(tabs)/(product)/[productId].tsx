import { View, Text, TouchableOpacity, Image, FlatList, Animated, ActivityIndicator, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { fetchProductById } from '../../../lib/utils';
import { productInterface, review, productType } from '../../../lib/interface';
import ProductDropdownComponent from '../../../components/ProductDropdown';
import QuantityDropdownComponent from '../../../components/QuantityDropdown';
import { FontAwesome } from '@expo/vector-icons';
import { dateFormatting } from '@/lib/dateFormat';

export default function ProductPage() {
    const router = useRouter();
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [product, setProduct] = useState<productInterface | null>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { width, height } = useWindowDimensions();
    const [selectedType, setSelectedType] = useState<productType | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState< string >("1");
    let imageWidth = width > 600 ? width * 0.4 : width * 0.8; // Set image width to 80% of screen width

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
        if(product){
            setSelectedType(product.productTypes[0]);
        }
    }, [product]);

    useEffect(()=>{
            setSelectedQuantity("1");

    }, [selectedType]);

    if (!product) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="grey" />
            </View>
        );
    }

    const renderReview = ({ item }: { item: review }) => (
        <View className="mb-4 rounded-md border border-gray-500 p-2">
            <Text className="font-semibold">{item.user}</Text>
            <Text>{dateFormatting(item.updatedAt)}</Text>
            <Text>{item.rating} Stars</Text>
            <Text>{item.comment}</Text>
        </View>
    );
    const renderHeader = ()=>{
        return (
            <View>
                <View
                className={width > 600 ? "flex-row justify-evenly" : "flex-column"}>
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
                                        (index - 1) * width, // Previous page
                                        index * width,       // Current page
                                        (index + 1) * width, // Next page
                                    ],
                                    outputRange: [0.3, 1, 0.3],
                                    extrapolate: 'clamp', // Ensures values stay in the range [0.3, 1, 0.3]
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
                        <Text>{'★' + (product.rating % 1 === 0 ? product.rating.toFixed(0) : product.rating.toFixed(1)) + `(${product.reviews.length})` }</Text>

                        <View className="w-full h-[1px] bg-gray-600 my-3"></View>

                        <Text className="text-2xl" style={{ fontFamily: "MontserratBold" }}>{selectedType && "$" + selectedType.price}</Text>
                        <ProductDropdownComponent value= {selectedType} select={setSelectedType} data={product.productTypes}/>
                        {(selectedType && selectedType.quantity > 0)? (
                        <View>
                            <QuantityDropdownComponent currentQuantity= {selectedQuantity} select={setSelectedQuantity} maxQuantity={selectedType.quantity } />
                            <View className="flex-column items-center">
                                <TouchableOpacity className="bg-blue-400 w-[95%] p-3 rounded-3xl m-2">
                                    <Text className="text-center text-white">Add to cart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="bg-orange-400 w-[95%] p-3 rounded-3xl m-2">
                                    <Text className="text-center">Buy now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>) : <Text className="text-red-700 text-lg">Out of stock</Text>}
                    </View>
                </View>
                <View className="mt-2">
                    <Text style={{ fontFamily: "MontserratRegular" }}>{product.description}</Text>

                    <View className="w-full h-[1px] bg-gray-600 my-3"></View>

                    <Text className="mb-2">Item reviews</Text>
                </View>
            </View>
        )
    }
    const sortedAndLimitedReviews = product.reviews
    .sort((a, b) => b.rating - a.rating) // Sort by updatedAt (newest first)
    .slice(0, 3); // Get the first 3 reviews
    return (
        <View className="p-5 bg-c3 flex-1">
            <TouchableOpacity
            className="ml-4 mt-16 mb-0 absolute z-10"
            onPress={() => router.back()}
            >
                <FontAwesome
                name="arrow-left"
                size={20}
                color="white"
                className="ml-2" // Adds some margin to the left of the icon
                />
            </TouchableOpacity>
            <FlatList
            className="mt-16"
            data={sortedAndLimitedReviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent= {
                renderHeader
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
                <TouchableOpacity>
                    <Text>See All Reviews</Text>
                </TouchableOpacity>
            }
        />
    </View>
    );
}