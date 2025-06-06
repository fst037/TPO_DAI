import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const BotonCircularBlanco = ({ IconComponent, onPress }) => {
  return (
    <Pressable
      style={styles.boton}
      onPress={onPress}
    >
      <IconComponent size={35} color="#000" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  boton: {
    height: 43,
    width: 43,
    borderRadius: 21.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default BotonCircularBlanco;
