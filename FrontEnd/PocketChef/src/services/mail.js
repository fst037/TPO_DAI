import { NoAuth } from './api';
export const sendEmail = async ({ to, subject, body }) => {
  return await NoAuth('/email/send', {
    method: 'POST',
    body: JSON.stringify({ 
      to,
      subject, 
      body 
    }),
  });
};