import { create } from 'zustand';
import { apiFetch, clearToken, getToken, setToken } from '../api';
import type { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: null,
  hydrated: false,

  // On app load: if a token is already in localStorage, fetch the profile
  // so a refresh doesn't bounce the user back to /login.
  hydrate: async () => {
    const token = getToken();
    if (!token) {
      set({ hydrated: true });
      return;
    }
    try {
      const { user } = await apiFetch<{ user: User }>('/user/me');
      set({ user, status: 'authenticated', hydrated: true });
    } catch {
      clearToken();
      set({ user: null, status: 'idle', hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ status: 'loading', error: null });
    try {
      const data = await apiFetch<AuthResponse>('/user/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      setToken(data.token);
      set({ user: data.user, status: 'authenticated', error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      set({ status: 'error', error: message });
      throw err;
    }
  },

  register: async (fullName, email, password) => {
    set({ status: 'loading', error: null });
    try {
      const data = await apiFetch<AuthResponse>('/user/register', {
        method: 'POST',
        body: { fullName, email, password },
        auth: false,
      });
      setToken(data.token);
      set({ user: data.user, status: 'authenticated', error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ status: 'error', error: message });
      throw err;
    }
  },

  updateProfile: async (fullName) => {
    const { user } = await apiFetch<{ user: User }>('/user/me', {
      method: 'PUT',
      body: { fullName },
    });
    set({ user });
  },

  logout: () => {
    clearToken();
    set({ user: null, status: 'idle', error: null });
  },
}));
