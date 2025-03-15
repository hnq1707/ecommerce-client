/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { auth, signIn, signOut } from '@/auth';

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
export const handleLogout = async () => {
  await signOut({redirectTo: '/login'});
  
};
export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
};
export const updateUser = async (id: any,updateData: any) => {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const result = await response.json();
    console.log('User updated:', result);
    return result;
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
};