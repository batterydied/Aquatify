import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Animated,
    ActivityIndicator,
    useWindowDimensions,
    Modal,
  } from "react-native";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import { useEffect, useState, useRef } from "react";
  import { getProductById, addItemToCart, sortImageById } from "../../lib/apiCalls";
  import { productInterface, review, productType, reviewSortOption } from "../../lib/interface";
  import ProductDropdownComponent from "../../components/ProductDropdown";
  import QuantityDropdownComponent from "../../components/QuantityDropdown";
  import ReviewFilterDropdown from "../../components/ReviewFilterDropdwon";
  import ReviewComponent from "../../components/ReviewComponent";
  import { useUserData } from "@/contexts/UserContext";
  import { Redirect } from "expo-router";
  import { SafeAreaView } from "react-native-safe-area-context";
import BackArrow from "@/components/BackArrow";
  
  export default function ProductPage() {
    const {userData} = useUserData();
    const router = useRouter();
    const {productId, fromPage, orderId} = useLocalSearchParams<{ productId: string, fromPage: string, orderId?: string}>();
    const [product, setProduct] = useState<productInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const scrollX = useRef(new Animated.Value(0)).current;
    const {width } = useWindowDimensions();
    const [selectedType, setSelectedType] = useState<productType | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<string>("1");
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [showAllReviewsFilter, setShowAllReviewsFilter] = useState<reviewSortOption>({
      label: "Sort by Stars (Highest)",
      value: "sortByStarsHighest",
    });
    let imageWidth = width > 600 ? width * 0.4 : width * 0.8; // Set image width to 80% of screen width
  
    const fetchProductData = async () => {
      setLoading(true); // Start loading
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    useEffect(() => {
      fetchProductData();
    }, [productId]);  

    useEffect(() => {
      if (product) {
        setSelectedType(product.productTypes[0]);
      }
    }, [product]);
  
    useEffect(() => {
      setSelectedQuantity("1");
    }, [selectedType]);
  
    if (!userData) {
      return <Redirect href="/sign-in" />;
    }
  
    if (loading) {
      // Show loading spinner while data is being fetched
      return (
        <View className="flex-1 justify-center items-center bg-gray-200">
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
  
    if (!product) {
      // Handle case where product data is not available
      return (
        <View className="flex-1 justify-center items-center bg-gray-200">
          <Text className="text-lg" style={{ fontFamily: "MontserratRegular" }}>
            Product not found.
          </Text>
        </View>
      );
    }
    const renderReview = ({ item }: { item: review }) => (
      <ReviewComponent
        user={item.user}
        userId={item.userId}
        updatedAt={item.updatedAt}
        rating={item.rating}
        comment={item.comment}
      />
    );
  
    const renderModalReview = ({ item }: { item: review }) => (
      <ReviewComponent
        user={item.user}
        userId={item.userId}
        updatedAt={item.updatedAt}
        rating={item.rating}
        comment={item.comment}
        isModal={true} // Add modal-specific styling or behavior
      />
    );
  
    const handleAddItemToCart = () => {
      const productId = product.productId;
      const productTypeId = selectedType?.id;
      if (!productTypeId) {
        return;
      }
      const quantity = parseFloat(selectedQuantity);
      const userId = userData.id;
      addItemToCart(productId, productTypeId, quantity, userId);
    };
    
    const handleBack = ()=>{
      if (fromPage === "/(tabs)/orders" && orderId) {
        router.push({
            pathname: "/(tabs)/orderList",
            params: { orderId },
        });
      }else{
        router.push(fromPage as any)
      }
    }
    const renderHeader = () => {
      const images = sortImageById(product.images);
      return (
        <View>
          <View className={width > 600 ? "flex-row justify-evenly" : "flex-column"}>
            {/* Product Images */}
            <View className="items-center">
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
            <View className={width > 600 ? "w-[50%]" : "w-[100%]"}>
              {/* Product Details */}
              <Text className="text-gray-700" style={{ fontFamily: "MontserratRegular" }}>
                {product.secondaryName}
              </Text>
              <Text className="text-xl" style={{ fontFamily: "MontserratBold" }}>
                {product.name}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-xl text-blue-800" style={{ fontFamily: "MontserratRegular" }}>
                  {"Visit the " + product.shopName + " store"}
                </Text>
              </TouchableOpacity>
              <Text>
                {"★" +
                  (product.rating % 1 === 0 ? product.rating.toFixed(0) : product.rating.toFixed(1)) +
                  `(${product.reviews.length})`}
              </Text>
  
              <View className="w-full h-[1px] bg-gray-600 my-3"></View>
  
              <Text className="text-2xl" style={{ fontFamily: "MontserratBold" }}>
                {selectedType && "$" + selectedType.price}
              </Text>
              <ProductDropdownComponent
                value={selectedType}
                select={setSelectedType}
                data={product.productTypes}
              />
              {selectedType && selectedType.quantity > 0 ? (
                <View>
                  <QuantityDropdownComponent
                    currentQuantity={selectedQuantity}
                    select={setSelectedQuantity}
                    maxQuantity={selectedType.quantity}
                  />
                  <View className="flex-column items-center">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="bg-blue-400 w-[95%] p-3 rounded-full m-2"
                      onPress={handleAddItemToCart}
                    >
                      <Text className="text-center text-white">Add to cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="bg-orange-400 w-[95%] p-3 rounded-full m-2"
                    >
                      <Text className="text-center">Buy now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text className="text-red-700 text-lg">Out of stock</Text>
              )}
            </View>
          </View>
          <View className="mt-2">
            <Text style={{ fontFamily: "MontserratRegular" }}>{product.description}</Text>
  
            <View className="w-full h-[1px] bg-gray-600 my-3"></View>
  
            <Text className="mb-2">Item reviews</Text>
          </View>
        </View>
      );
    };
  
    const reviewFilter = (reviews: review[]) => {
      switch (showAllReviewsFilter.value) {
        case "sortByDateNewest":
          return reviews.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
  
        case "sortByDateOldest":
          return reviews.sort(
            (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
  
        case "sortByStarsHighest":
          return reviews.sort((a, b) => b.rating - a.rating);
  
        case "sortByStarsLowest":
          return reviews.sort((a, b) => a.rating - b.rating);
  
        default:
          return reviews;
      }
    };
  
    const sortedAndLimitedReviews = product.reviews
      .sort((a, b) => b.rating - a.rating) // Sort by updatedAt (newest first)
      .slice(0, 3); // Get the first 3 reviews
  
    return (
      <SafeAreaView className="bg-gray-200 flex-1">
        <BackArrow handleBack={handleBack}/>
        <FlatList
        className="p-4"
        data={sortedAndLimitedReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAllReviews(true)}>
              <Text className="text-blue-800">See All Reviews</Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={showAllReviews}>
              <BackArrow handleBack={() => setShowAllReviews(false)} 
              style={{
                marginTop: 64,
                position: 'absolute',
                zIndex: 10, 
              }}
              />
              <View className="flex-1 items-center bg-gray-200">
                <View className="mt-24 w-[95%] h-[85%]">
                  <ReviewFilterDropdown
                    sortOption={showAllReviewsFilter}
                    select={setShowAllReviewsFilter}
                  />
                  <FlatList
                    data={reviewFilter(product.reviews)}
                    renderItem={renderModalReview}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </Modal>
          </View>
        }
        />
      </SafeAreaView>
    );
  }