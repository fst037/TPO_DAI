import { NoAuth } from './api';

export const requestInitialRegister = async ({ email, password, alias }) => {
  return await NoAuth('/api/v1/auth/requestInitialRegister', {
    method: 'POST',
    body: JSON.stringify({ email, password, alias }),
  });
};

export const register = async ({ email, code }) => {
  return await NoAuth('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
};

export const authenticate = async ({ email, password }) => {
  return await NoAuth('/api/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const recoverPassword = async ({ email }) => {
  return await NoAuth('/api/v1/auth/recoverPassword', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async ({ email, password, verificationCode }) => {
  return await NoAuth('/api/v1/auth/resetPassword', {
    method: 'POST',
    body: JSON.stringify({ email, password, verificationCode }),
  });
};
