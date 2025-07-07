import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// DEFINIR LA URL BASE DE LA API (Spring Boot suele ser puerto 4002)

let BASE_URL = 'https://orange-broccoli-wr75rxg49pjph5pxj-4002.app.github.dev'; // maquina virtual gratis de GitHub

// Alternativas
// let BASE_URL = 'http://localhost:4002';
// BASE_URL = 'http://192.168.1.6:4002'; // IP anterior
// BASE_URL = 'http://192.168.68.113:4002'; // IP anterior
// BASE_URL = 'http://192.168.0.233:4002';



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
