import type { User } from "../types/AuthType";

/**
 * Get user info from cookies
 */
export const getUserFromCookies = (): User | null => {
  try {
    const cookies = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userInfo='));
    
    if (!cookies) return null;
    
    const userInfo = decodeURIComponent(cookies.split('=')[1]);
    return JSON.parse(userInfo);
  } catch (error) {
    console.error('Error parsing user info from cookies:', error);
    return null;
  }
};

/**
 * Get token from cookies
 */
export const getTokenFromCookies = (): string | null => {
  const cookies = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='));
  
  return cookies ? decodeURIComponent(cookies.split('=')[1]) : null;
};

/**
 * Remove auth cookies
 */
export const removeAuthCookies = (): void => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Set auth cookies
 */
export const setAuthCookies = (token: string, user: User): void => {
  // Set token cookie
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400`; // 24 hours
  
  // Set user info cookie
  document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`;
};