import { apiRequest } from './client';
import { tokenStore } from './tokenStore';
import type { AuthTokens, ProfileInput, RegisterPayload, User, UserMe } from '@/types';

// Thin wrappers over /api/v1/auth. Token persistence lives here so callers
// only deal with domain objects.
export const authApi = {
  register: (payload: RegisterPayload): Promise<User> =>
    apiRequest<User>('/auth/register', { method: 'POST', body: payload, auth: false }),

  login: async (usernameOrEmail: string, password: string): Promise<AuthTokens> => {
    const tokens = await apiRequest<AuthTokens>('/auth/login', {
      method: 'POST',
      body: { username_or_email: usernameOrEmail, password },
      auth: false,
      skipRefresh: true,
    });
    tokenStore.set(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  // Exchange a Google ID token (GIS credential) for our own JWT pair.
  // Same response shape as /auth/login, so the success path is identical.
  googleLogin: async (idToken: string): Promise<AuthTokens> => {
    const tokens = await apiRequest<AuthTokens>('/auth/google', {
      method: 'POST',
      body: { id_token: idToken },
      auth: false,
      skipRefresh: true,
    });
    tokenStore.set(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  me: (): Promise<UserMe> => apiRequest<UserMe>('/auth/me', { method: 'GET' }),

  updateProfile: (data: ProfileInput): Promise<User> =>
    apiRequest<User>('/users/me', { method: 'PUT', body: data }),

  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Even if the blacklist call fails, drop local tokens below.
    } finally {
      tokenStore.clear();
    }
  },

  changePassword: (oldPassword: string, newPassword: string): Promise<{ message: string }> =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: { old_password: oldPassword, new_password: newPassword },
    }),

  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiRequest('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),
};
