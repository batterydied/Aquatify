import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import { paymentMethod } from '@/lib/interface';

type PaymentMethodsDropdownProps = {
  data: paymentMethod[];
  value: paymentMethod | null;
  select: (item: paymentMethod) => void;
};

const PaymentMethodsDropdown: React.FC<PaymentMethodsDropdownProps> = ({ data, select, value }) => {
  const sortedPaymentMethods = data.sort((a, b) => a.id.localeCompare(b.id)); // Sort payment methods by ID

  const renderItem = (item: paymentMethod) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>
          {`${item.cardName} - **** **** **** ${item.cardNumber.slice(-4)}`}
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
      data={sortedPaymentMethods}
      maxHeight={220}
      labelField="cardName" // Display cardName as the label
      valueField="id" // Use id as the unique value
      value={value}
      onChange={(item) => {
        select(item);
      }}
      renderItem={renderItem}
      placeholder="Select a payment method"
    />
  );
};

export default PaymentMethodsDropdown;

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