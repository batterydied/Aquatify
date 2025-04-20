import { View, Image, TouchableOpacity, Text } from "react-native";
import { sortImageById } from "../lib/apiCalls";
import { productGrid } from "../lib/interface";
import { goToProductPage } from "../lib/goToProductPage";
import { formatReviewsCount } from "../lib/reviewFormat";

 const FlatlistItem = ({item, path, itemWidth}: {item: productGrid, path: string, itemWidth: number}) => {
    const images = sortImageById(item.images);

    return (
        <View className="mb-4" style={[{ width: itemWidth, height: itemWidth }]}>
        <View className="flex-1 m-1">
            <TouchableOpacity activeOpacity={0.7} onPress={() => goToProductPage(item.productId, path)}>
                <Image
                    source={images && images[0]? { uri: images[0].url }: require('../assets/images/no-image-icon.png')}
                    className="h-[85%] w-full rounded-lg"
                    resizeMode="cover"
                />
                <View className="h-[15%]">
                    <Text style={{ fontFamily: "MontserratRegular" }}>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</Text>
                    <View className="flex-row justify-between">
                        <Text style={{ fontFamily: "MontserratRegular" }}>{'$' + item.price}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>{item.rating % 1 === 0 ? `${item.rating.toFixed(0)}` : `${item.rating.toFixed(1)}`}{'★'}{` (${formatReviewsCount(item.reviews.length)})`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
        </View>
    )
};

export default FlatlistItem;
