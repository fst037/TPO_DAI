import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default function PrimaryButton({ title, onPress, style, disabled, ...props }) {
  return (
    <TouchableOpacity style={[styles.button, style, (disabled ? styles.disabled : "")]} onPress={onPress} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'stretch',
  },
  text: {
    color: colors.primaryText,
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabled: {
    backgroundColor: colors.mutedText,
    opacity: 0.6,
  },
});
