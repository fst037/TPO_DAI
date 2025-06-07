import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function PageTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    marginTop: 8,
    textAlign: 'center',
  },
});
