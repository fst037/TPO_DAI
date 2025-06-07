import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const BotonCircularBlanco = ({ IconComponent, onPress }) => {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <IconComponent width={24} height={24} />
    </TouchableOpacity>
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
