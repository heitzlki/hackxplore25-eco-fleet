import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// Types
type LoginCredentials = {
  email: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  name: string;
};

type LoginResponse = {
  user: User;
  token: string;
};

// API functions
async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  const data = await response.json();

  // Store token in localStorage or secure cookie
  localStorage.setItem('auth-token', data.token);

  return data;
}

async function fetchCurrentUser(): Promise<User> {
  const token = localStorage.getItem('auth-token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth-token');
      throw new Error('Session expired');
    }
    throw new Error('Failed to fetch user');
  }

  return response.json();
}

async function logoutUser(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
    },
  });

  localStorage.removeItem('auth-token');
}

// Hooks
export function useLogin(options: any = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
    },
  });
}

export function useLogout(options: any = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (options.onSuccess) options.onSuccess();
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function isAuthenticated() {
  return !!localStorage.getItem('auth-token');
}
