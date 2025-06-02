import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.63.113:4002';

export const NoAuth = async (endpoint, options = {}) => {
  const res = await fetch(BASE_URL + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return res;
};

export const Auth = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(BASE_URL + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  return res;
};
