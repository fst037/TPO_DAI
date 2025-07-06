import { Auth } from './api';

// Get student by ID
export const getStudentById = async (id) => Auth(`/students/${id}`);

// Update payment method for student
export const changePaymentMethod = async (paymentMethod) => Auth('/students/payment-method', {
  method: 'PUT',
  body: JSON.stringify(paymentMethod),
});

// Mark assistance to a course
export const markCourseAssistance = async (courseScheduleId, date) => Auth(`/students/mark-assistance/${courseScheduleId}/${date}`, {
  method: 'POST'
});

// Enroll in a course with credit card
export const enrollInCourseWithCreditCard = async (courseScheduleId) => Auth(`/students/enroll/${courseScheduleId}`, {
  method: 'POST'
});

// Drop out of a course to credit card
export const dropOutOfCourseToCreditCard = async (courseScheduleId) => Auth(`/students/drop-out/credit-card/${courseScheduleId}`, {
  method: 'POST'
});

// Drop out of a course to app balance
export const dropOutOfCourseToAppBalance = async (courseScheduleId) => Auth(`/students/drop-out/app-balance/${courseScheduleId}`, {
  method: 'POST'
});
