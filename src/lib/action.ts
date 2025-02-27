/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { signIn, signOut } from '@/auth';
export const login2 = async (
  provider: string,
  credentials?: { email: string; password: string },
) => {
  try {
    const result = await signIn(provider, {
      redirect: false,
      ...credentials,
    });

    return result || { error: 'Login failed' }; // Tránh undefined
  } catch (error : any) {
    return { error: error.message || 'An error occurred' };
  }
};
export const logout = async () => {
  await signOut({redirectTo: '/login'});
};
export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
};