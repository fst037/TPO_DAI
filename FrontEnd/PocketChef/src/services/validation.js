import { NoAuth } from './api';

export const isRecipeNameAvailable = async (name) => {
  return await NoAuth(`/recipes/isNameAvaliable/${encodeURIComponent(name)}`);
};

export const isEmailAvailable = async (email) => {
  return await NoAuth(`/api/v1/auth/checkEmailAvailable?email=${encodeURIComponent(email)}`);
};
