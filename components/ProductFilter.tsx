import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import ErrorText from "./ErrorText";
import { categoryTypes, filterCriteriaType } from "@/lib/interface";

const ProductFilter = ({
        modalVisible,
        currFilterCriteria,
        setCurrFilterCriteria,
        filterError,
        handleCategoryToggle, 
        resetFilter,
        setModalVisible,
        applyFilters
    }:{
        modalVisible: boolean,
        currFilterCriteria: filterCriteriaType,
        setCurrFilterCriteria: (val: filterCriteriaType) => void,
        filterError: boolean,
        handleCategoryToggle: (category: string) => void,
        resetFilter: () => void,
        setModalVisible: (val: boolean) => void,
        applyFilters: (val: filterCriteriaType) => void
    })=>{
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View className="flex-1 justify-center items-center " 
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            >
                <View className="bg-white p-6 rounded-lg"
                style={{
                    width: "80%",
                }}
                >
                    <Text className="text-lg font-bold mb-4" style={{ fontFamily: "MontserratBold" }}>Filters</Text>
                    <TextInput
                        placeholder="Min price"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={currFilterCriteria.minPrice?.toString() || ""}
                        onChangeText={(text) =>
                            setCurrFilterCriteria({
                                ...currFilterCriteria,
                                minPrice: parseFloat(text) || null,
                            })
                        }
                        className={`p-2 border-[1px] border-gray-300 rounded ${!filterError ? "mb-4" : ""}`}
                        style={{ fontFamily: "MontserratRegular" }}
                    />
                    {filterError && <ErrorText message="Min price can't be higher than max price."/>}
                    <TextInput
                        placeholder="Max price"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={currFilterCriteria.maxPrice?.toString() || ""}
                        onChangeText={(text) =>
                            setCurrFilterCriteria({
                                ...currFilterCriteria,
                                maxPrice: parseFloat(text) || null,
                            })
                        }
                        className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                        style={{ fontFamily: "MontserratRegular" }}
                    />
                    <TextInput
                        placeholder="Min rating"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={currFilterCriteria.minRating?.toString() || ""}
                        onChangeText={(text) => {
                            const numericValue = parseFloat(text);
                            // Ensure the value is between 0 and 5
                            if (!isNaN(numericValue)) {
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    minRating: Math.max(0, Math.min(5, numericValue)), // Clamp value between 0 and 5
                                });
                            } else {
                                setCurrFilterCriteria({
                                    ...currFilterCriteria,
                                    minRating: null, // Clear value if input is not a valid number
                                });
                            }
                        }}
                        className="mb-4 p-2 border-[1px] border-gray-300 rounded"
                        style={{ fontFamily: "MontserratRegular" }}
                    />
                    <Text style={{ fontFamily: "MontserratBold" }}>Categories:</Text>
                    <View className="mb-4">
                        {categoryTypes.map((category) => (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                key={category}
                                onPress={()=>handleCategoryToggle(category)}
                            >
                                <Text className={currFilterCriteria.categories.includes(category) ? "text-blue-500" : "text-black"}>{category}</Text></TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row w-full">
                        <TouchableOpacity activeOpacity={0.7} 
                            onPress={() => resetFilter()}
                            style={{
                                width: "40%"
                            }}
                        >
                            <Text className="text-red-500" style={{ fontFamily: "MontserratRegular" }}>Reset filter</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-end"
                        style={{
                            width: "60%",
                            justifyContent: "flex-end"
                        }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setModalVisible(false)}
                                className="mr-4"
                            >
                                <Text className="text-gray-600" style={{ fontFamily: "MontserratRegular" }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => applyFilters(currFilterCriteria)}>
                                <Text className="text-blue-600" style={{ fontFamily: "MontserratRegular" }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ProductFilter
