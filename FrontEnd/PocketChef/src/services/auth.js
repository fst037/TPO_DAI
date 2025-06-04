import { NoAuth } from './api';

export const requestInitialRegister = async ({ email, nickname }) => {
  return await NoAuth('/api/v1/auth/requestInitialRegister', {
    method: 'POST',
    body: JSON.stringify({ email, nickname }),
  });
};

export const register = async ({ email, nickname, nombre, direccion, password, verificationCode }) => {
  return await NoAuth('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, nickname, nombre, direccion, password, verificationCode }),
  });
};

export const authenticate = async ({ email, password }) => {
  return await NoAuth('/api/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const recoverPassword = async ({ email }) => {
  const response = await NoAuth('/api/v1/auth/recoverPassword', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return response.data;
};

export const resetPassword = async ({ email, password, verificationCode }) => {
  const response = await NoAuth('/api/v1/auth/resetPassword', {
    method: 'POST',
    body: JSON.stringify({ email, password, verificationCode }),
  });
  return response.data;
};
