/* eslint-disable @typescript-eslint/no-require-imports */
import { auth } from '@/auth';
import axios from 'axios';
import { getSession } from 'next-auth/react'; // Client-side


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  let session;

  if (typeof window !== 'undefined') {
    // Client-side: Sử dụng getSession từ next-auth/react
    session = await getSession();
  } else {
    // Server-side: Sử dụng getServerSession từ next-auth
    session = await auth();
  }


  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  return config;
});

export default api;
