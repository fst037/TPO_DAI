import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default function SecondaryButton({ title, onPress, style, textStyle, ...props }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
