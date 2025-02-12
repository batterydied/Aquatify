import { View, Text } from "react-native";
import { dateFormatting } from "@/lib/dateFormat";
import { FontAwesome } from "@expo/vector-icons";

const ReviewItem = ({
    user,
    userId,
    updatedAt,
    rating,
    comment,
    isModal = false,
} : {
    user: string;
    userId: string;
    updatedAt: string;
    rating: number;
    comment: string;
    isModal?: boolean;
}) => (
    <View className={`${isModal ? "" : "mb-4 rounded-md border border-gray-500 p-2"}`}>
        <Text className="text-sm">{user}</Text>
        <Text className="text-sm text-blue-800">{userId}</Text>
        <Text className="text-sm">{dateFormatting(updatedAt)}</Text>
        <Text className="flex-row pb-2">
            {Array(rating)
                .fill(null)
                .map((_, index) => (
                    <FontAwesome
                        key={index}
                        name="star"
                        size={16}
                        color="gold"
                        style={{ marginHorizontal: 2 }}
                    />
                ))}
        </Text>
        <Text>{comment}</Text>
        {isModal && <View className="w-full h-[1px] bg-gray-600 my-3"></View>}
    </View>
);

export default ReviewItem;