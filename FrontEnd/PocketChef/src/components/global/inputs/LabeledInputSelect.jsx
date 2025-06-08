import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function LabeledInputSelect({ label, value, options, onSelect, placeholder, disabled }) {
  const [showList, setShowList] = React.useState(false);

  const handleSelect = (val) => {
    setShowList(false);
    onSelect(val);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowList((prev) => !prev)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? (options.find(opt => opt.value === value)?.label || value) : placeholder || 'Seleccionar...'}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={colors.inputBorder} style={styles.icon} />
      </TouchableOpacity>
      {showList && !disabled && (
        <View style={styles.dropdownListWrapper} pointerEvents="box-none">
          <ScrollView style={styles.dropdownListScrollable} nestedScrollEnabled={true}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.dropdownItem}
                onPress={() => handleSelect(opt.value)}
              >
                <Text style={[styles.dropdownText, value === opt.value && styles.selectedDropdownText]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  label: {
    marginBottom: 2,
    fontWeight: 'bold',
    color: colors.label,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputDisabled: {
    backgroundColor: colors.mutedText,
    opacity: 0.6,
  },
  value: {
    fontSize: 16,
    color: colors.clickableText,
    flex: 1,
  },
  placeholder: {
    color: colors.mutedText,
  },
  icon: {
    marginLeft: 8,
  },
  dropdownListWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 66, // Adjust as needed to match input height
    zIndex: 100,
    elevation: 3,
  },
  dropdownListScrollable: {
    maxHeight: 200,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.clickableText,
  },
  selectedDropdownText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
