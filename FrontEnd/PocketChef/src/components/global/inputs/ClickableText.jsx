import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default function ClickableText({ children, onPress, style, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <Text style={[styles.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.clickableText,
    textDecorationLine: 'underline',
    fontSize: 15,
    marginVertical: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
});
