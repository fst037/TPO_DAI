import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default function LabeledInput({ label, value, onChangeText, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  label: { marginBottom: 2, fontWeight: 'bold', color: colors.label },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.background,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    fontSize: 18,
    alignSelf: 'stretch',
  },
});
