import { Auth } from './api';

// Get user by ID
export const getUserById = async (userId) => Auth(`/users/${userId}`);

// Delete user by ID
export const deleteUser = async (userId) => Auth(`/users/${userId}`, { method: 'DELETE' });

// Update user profile (alias, profile picture, address)
export const updateProfile = async ({ nombre, nickname, direccion, avatar }) => {
  const body = JSON.stringify({ nombre, nickname, direccion, avatar });
  return Auth('/users/updateProfile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
};

// Update user password
export const updatePassword = async ({ currentPassword, newPassword }) => {
  const params = new URLSearchParams();
  params.append('currentPassword', currentPassword);
  params.append('newPassword', newPassword);
  return Auth(`/users/updatePassword?${params.toString()}`, { method: 'PUT' });
};

// Update user email
export const updateEmail = async (newEmail) => {
  const params = new URLSearchParams();
  params.append('newEmail', newEmail);
  return Auth(`/users/updateEmail?${params.toString()}`, { method: 'PUT' });
};

// Enable user by ID
export const enableUser = async (userId) => Auth(`/users/enable/${userId}`, { method: 'PUT' });

// Get current authenticated user info
export const whoAmI = async () => Auth('/users/whoAmI');

// Upgrade user to student with card validation
export const upgradeToStudent = async (cardData) => {
  return Auth('/users/upgradeToStudent', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });
};
