import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AlertModal({ visible, title, message, onClose, buttonText = 'OK' }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.confirm]}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxWidth: '90%',
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  message: {
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFA726',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
