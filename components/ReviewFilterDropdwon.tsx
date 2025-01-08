import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import { reviewSortOptionArray, reviewSortOption } from '@/lib/interface';

type DropdownComponentProps = {
    sortOption: reviewSortOption
    select: (option: reviewSortOption)=>void;
};

const DropdownComponent: React.FC<DropdownComponentProps> = ({ sortOption, select}) => {
  const renderItem = (option: reviewSortOption) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{option.label}</Text>
        {option.value === sortOption.value && (
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
    data={reviewSortOptionArray}
    maxHeight={220}
    labelField="label"
    valueField="value"
    value={sortOption}

    onChange={item => {
    select(item);
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