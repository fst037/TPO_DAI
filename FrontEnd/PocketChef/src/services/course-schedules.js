import { NoAuth } from './api';

// Get course schedule by ID
export const getCourseScheduleById = async (id) => NoAuth(`/course-schedules/${id}`);

// Get all course schedules by course ID
export const getCourseSchedulesByCourseId = async (courseId) => NoAuth(`/course-schedules/course/${courseId}`);
