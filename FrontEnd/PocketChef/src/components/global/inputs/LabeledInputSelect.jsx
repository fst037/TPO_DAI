import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function LabeledInputSelect({ label, value, options, onSelect, placeholder, disabled, multiple, style, inputStyle, dropdownStyle, dropdownItemStyle, dropdownTextStyle }) {
  const [showList, setShowList] = React.useState(false);

  // For multi-select, value is an array; for single, it's a value
  const isSelected = (val) => {
    if (multiple) return Array.isArray(value) && value.includes(val);
    return value === val;
  };

  const handleSelect = (val) => {
    if (multiple) {
      let newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(val)) {
        newValue = newValue.filter(v => v !== val);
      } else {
        newValue.push(val);
      }
      onSelect(newValue);
      // Keep dropdown open for multi-select
    } else {
      setShowList(false);
      onSelect(val);
    }
  };

  // For multi-select, show all selected labels
  const displayValue = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder || 'Seleccionar...';
      return options.filter(opt => value.includes(opt.value)).map(opt => opt.label).join(', ');
    } else {
      return value !== undefined && value !== null
        ? (options.find(opt => opt.value === value)?.label ?? String(value))
        : (placeholder || 'Seleccionar...');
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, inputStyle, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowList((prev) => !prev)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1} ellipsizeMode="tail">
          {displayValue()}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={colors.inputBorder} style={styles.icon} />
      </TouchableOpacity>
      {showList && !disabled && (
        <View style={[styles.dropdownListWrapper, dropdownStyle]} pointerEvents="box-none">
          <ScrollView style={styles.dropdownListScrollable} nestedScrollEnabled={true}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.dropdownItem, dropdownItemStyle]}
                onPress={() => handleSelect(opt.value)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {multiple && (
                    <MaterialIcons
                      name={isSelected(opt.value) ? 'check-box' : 'check-box-outline-blank'}
                      size={20}
                      color={isSelected(opt.value) ? colors.primary : colors.inputBorder}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text style={[styles.dropdownText, isSelected(opt.value) && styles.selectedDropdownText, dropdownTextStyle]}>{opt.label}</Text>
                </View>
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
