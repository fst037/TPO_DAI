import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración automática basada en el entorno
const getBaseURL = () => {
  // Verifica si estamos en desarrollo local
  if (__DEV__ || window.location?.hostname === 'localhost') {
    return 'http://localhost:4002';
  }
  
  // Producción - GitHub Codespaces
  return 'https://orange-broccoli-wr75rxg49pjph5pxj-4002.app.github.dev';
};

let BASE_URL = getBaseURL();

// Override manual para testing
// BASE_URL = 'http://localhost:4002'; // Desarrollo local
// BASE_URL = 'https://orange-broccoli-wr75rxg49pjph5pxj-4002.app.github.dev'; // Producción
// Alternativas
// BASE_URL = 'http://192.168.1.6:4002'; // IP anterior
// BASE_URL = 'http://192.168.68.113:4002'; // IP anterior

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
