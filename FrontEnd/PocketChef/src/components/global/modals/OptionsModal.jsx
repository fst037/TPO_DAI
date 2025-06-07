import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default function OptionsModal({ visible, options, onRequestClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <View style={styles.modal}>
          {options.map((opt, idx) => (
            <React.Fragment key={idx}>
              <TouchableOpacity
                onPress={opt.onPress}
                style={[styles.option, opt.style]}
              >
                <Text style={[styles.optionText, opt.textStyle]}>{opt.label}</Text>
              </TouchableOpacity>
              {idx < options.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    maxWidth: '90%',
    minWidth: 180,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'stretch',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.clickableText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider, // Updated to use divider color from colors.js
    alignSelf: 'stretch',
  },
});
