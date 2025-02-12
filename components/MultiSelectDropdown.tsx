import React, { useState } from 'react';
  import { StyleSheet, View } from 'react-native';
  import { MultiSelect } from 'react-native-element-dropdown';

  const MultiSelectDropdown = ({
    placeholder, 
    selected, 
    setSelected, 
    data
  }: {
    placeholder: string, 
    selected: string[], 
    setSelected: (select: string[])=> void, 
    data: string[]
  }) => {
    const transformedData = data.map((item: string)=>{
      return {label: item, value: item}
    })
    return (
      <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={transformedData}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder="Search..."
          value={selected}
          onChange={item => {
            setSelected(item);
          }}
          selectedStyle={styles.selectedStyle}
        />
      </View>
    );
  };

  export default MultiSelectDropdown;

  const styles = StyleSheet.create({
    container: {
      padding: 8
    },
    dropdown: {
      height: 30,
      borderColor: "#6b7280",
      borderWidth: 1,
      padding: 8,
      borderRadius: 16,
    },
    placeholderStyle: {
      fontSize: 16,
      color: "black",
      fontFamily: "MontserratRegular"
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    selectedStyle: {
      borderRadius: 12,
    },
  });