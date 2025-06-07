import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function LabeledInputSelect({ label, value, options, onSelect, placeholder, disabled }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={onSelect}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? (options.find(opt => opt.value === value)?.label || value) : placeholder || 'Seleccionar...'}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={colors.inputBorder} style={styles.icon} />
      </TouchableOpacity>
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
});
