import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, NoAuth } from './api';
import { isTokenExpired } from '../utils/jwt';

// Get all courses
export const getAllCourses = async () => NoAuth('/courses/');

// Get course by ID
export const getCourseById = async (id) => NoAuth(`/courses/${id}`);

// Filter courses
export const getFilteredCourses = async (filter) => {
  const loggedUserToken = await AsyncStorage.getItem('token');

  if (loggedUserToken && !isTokenExpired(loggedUserToken)) {
    return Auth('/courses/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filter),
    });
  }

  return NoAuth('/courses/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filter),
  });
};
