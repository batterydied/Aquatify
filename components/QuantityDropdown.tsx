import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';

const DropdownComponent = ({ 
  maxQuantity,
  select, 
  currentQuantity
 } : {
  maxQuantity: number, 
  currentQuantity: string, 
  select: (quantity: string) => void
}) => {
  // Create an array of objects where each object contains the number as both label and value
  const quantityOptions = Array.from({ length: maxQuantity }, (_, index) => ({
    label: (index + 1).toString(),  // Label as the string number
    value: (index + 1).toString(),  // Value as the number
  }));

  const renderItem = (item: { label: string; value: string}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === currentQuantity && (
          <FontAwesome
            name="check"
            size={18}
            color="gray"
          />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={quantityOptions}  // Pass the object array with label and value
      maxHeight={220}
      labelField="label"   // Label field is the string number
      valueField="value"   // Value field is the numeric number
      value={currentQuantity?.toString() || "0"}
      onChange={item => {
        select(item.value);  // Use the selected item's value (numeric quantity)
      }}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 10,
    marginBottom: 10,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    fontFamily: "MontserratRegular",
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontFamily: "MontserratRegular",
    height: 40,
    fontSize: 16,
  },
});
