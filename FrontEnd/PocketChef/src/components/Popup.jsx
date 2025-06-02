import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function Popup({ visible, title, message, actions = [], children, onRequestClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity style={styles.fullscreenOverlay} activeOpacity={1} onPress={onRequestClose}>
        <View style={styles.popup} pointerEvents="box-none">
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}
          {children}
          <View style={styles.actions}>
            {actions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.button}
                onPress={action.onPress}
              >
                <Text style={styles.buttonText}>{action.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popup: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  button: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.popupButton,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.popupButtonText,
    fontWeight: 'bold',
  },
});
