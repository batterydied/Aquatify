import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import { address } from '@/lib/interface';

type AddressDropdownProps = {
  data: address[];
  value: address | null;
  select: (item: address) => void;
};

const AddressDropdown: React.FC<AddressDropdownProps> = ({ data, select, value }) => {
  const sortedAddresses = data.sort((a, b) => a.id.localeCompare(b.id)); // Sort addresses by ID

  const renderItem = (item: address) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>
          {`${item.streetAddress}, ${item.city}, ${item.state} ${item.zipCode}`}
        </Text>
        {item === value && (
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
      data={sortedAddresses}
      maxHeight={220}
      labelField="streetAddress" // Display streetAddress as the label
      valueField="id" // Use id as the unique value
      value={value}
      onChange={(item) => {
        select(item);
      }}
      renderItem={renderItem}
      placeholder="Select an address"
    />
  );
};

export default AddressDropdown;

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
    fontFamily: 'MontserratRegular',
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontFamily: 'MontserratRegular',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: 'MontserratRegular',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontFamily: 'MontserratRegular',
    height: 40,
    fontSize: 16,
  },
});