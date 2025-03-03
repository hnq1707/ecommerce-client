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
export const updateUser = async (formData: FormData) => {
  const id = formData.get('id') as string;
  const username = formData.get('username') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;

  const payload = {
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
  };

  try {
    const response = await fetch(`http://localhost:8080/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
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