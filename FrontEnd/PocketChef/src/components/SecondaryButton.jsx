import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
    borderColor: '#FFA726',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#FFA726',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
