import React, { useState } from 'react';
  import { StyleSheet, View, Text } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import { FontAwesome } from '@expo/vector-icons';
  import { useFonts } from 'expo-font';
  import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
  import { productType } from '@/lib/utils';

  type DropdownComponentProps = {
    data: productType[]
  };
  
  const DropdownComponent: React.FC<DropdownComponentProps> = ({ data }) => {
    const [fontsLoaded] = useFonts({
        MontserratRegular: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
    });
    const [value, setValue] = useState<productType>(data[0]);

    const renderItem = (item: productType) => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.type}</Text>
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
        data={data}
        maxHeight={220}
        labelField="type"
        valueField="id"

        value={value}

        onChange={item => {
          setValue(item);
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