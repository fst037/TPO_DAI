import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.233:4002';

export const NoAuth = async (endpoint, options = {}) => {
  const url = BASE_URL + endpoint;
  const method = options.method ? options.method.toLowerCase() : 'get';
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const data = options.body ? JSON.parse(options.body) : undefined;
  return axios({ url, method, headers, data });
};

export const Auth = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('token');
  const url = BASE_URL + endpoint;
  const method = options.method ? options.method.toLowerCase() : 'get';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  const data = options.body ? JSON.parse(options.body) : undefined;
  return axios({ url, method, headers, data });
};
