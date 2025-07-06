import ProtectLoggedIn from './global/ProtectLoggedIn';
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import DownArrow from '../../assets/DownArrow.svg';

const DropdownSelector = ({ options, onSelect, selectedOption, placeholder, isSmall = false }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => setShowOptions(!showOptions);

  const handleSelect = (option) => {
    onSelect(option);
    setShowOptions(false);
  };

  return (
    <View style={[dropdownStyles.container, isSmall && dropdownStyles.smallContainer]}>
      <ProtectLoggedIn onPress={toggleOptions} activeOpacity={0.8} style={[dropdownStyles.selector, isSmall && dropdownStyles.smallSelector]}>
        <Text style={dropdownStyles.label}>
          {selectedOption || placeholder || "Seleccionar"}
        </Text>
        <DownArrow width={15} height={15} />
      </ProtectLoggedIn>

      {showOptions && (
        <View style={[dropdownStyles.optionsContainer, isSmall && dropdownStyles.smallOptionsContainer]}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={dropdownStyles.scrollView}
          >
            {options.map((item, index) => (
              <TouchableOpacity
                key={`${item}-${index}`}
                style={dropdownStyles.optionContainer}
                onPress={() => handleSelect(item)}
              >
                <Text style={dropdownStyles.option}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 80,
  },
  smallContainer: {
    minWidth: 50,
    maxWidth: 60,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    borderWidth: 0.25,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 0.25,
    shadowOpacity: 0.5,
    elevation: 1, // Android
  },
  smallSelector: {
    paddingHorizontal: 8,
    minWidth: 50,
    maxWidth: 60,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0,
    fontWeight: "500",
    fontFamily: "Roboto Flex",
    color: "#606060",
    textAlign: "justify",
  },
  arrow: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 200,
  },
  smallOptionsContainer: {
    minWidth: 50,
    maxWidth: 60,
  },
  scrollView: {
    maxHeight: 200,
  },
  optionContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  option: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'RobotoFlex-Regular',
  },
});

export default DropdownSelector;