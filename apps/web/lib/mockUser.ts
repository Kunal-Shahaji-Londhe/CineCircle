/**
 * Mock user utility for development.
 * 
 * This provides a mock user object that can be used across the app
 * before real authentication is integrated.
 * 
 * TODO: Replace getCurrentUser() with actual auth session call once
 * real authentication is implemented.
 */

export const MOCK_USER = {
  id: 'user_mock_123',
  email: 'kunal@example.com',
  name: 'Kunal Londhe',
  avatarUrl: 'https://i.pravatar.cc/150?u=kunal',
}

/**
 * Gets the current authenticated user.
 * 
 * Currently returns a mock user. Once real auth is integrated,
 * replace this to fetch from auth context/session.
 * 
 * @returns The current user object
 */
export function getCurrentUser() {
  // Replace this function after auth integration
  return MOCK_USER
}

