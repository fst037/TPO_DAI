import React from 'react';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired } from '../../utils/jwt';
import { useNavigation } from '@react-navigation/native';

export default function ProtectLoggedIn({ onPress, children, ...props }) {
  const navigation = useNavigation();

  const handlePress = async (...args) => {
    const token = await AsyncStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      navigation.navigate('Login');
      return;
    }
    if (onPress) {
      onPress(...args);
    }
  };

  return (
    <TouchableOpacity {...props} onPress={handlePress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}
