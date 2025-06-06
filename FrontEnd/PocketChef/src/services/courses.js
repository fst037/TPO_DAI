import { NoAuth } from './api';

// Get all courses
export const getAllCourses = async () => NoAuth('/courses/');

// Get course by ID
export const getCourseById = async (id) => NoAuth(`/courses/${id}`);

// Filter courses
export const filterCourses = async (filter) => {
  // filter is an object matching CourseFilterRequest
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  return NoAuth(`/courses/filter?${params.toString()}`);
};
