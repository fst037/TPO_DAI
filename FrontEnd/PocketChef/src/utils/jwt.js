// src/utils/jwt.js
// Utility to check if a JWT is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;
    // exp is in seconds, Date.now() in ms
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
}
