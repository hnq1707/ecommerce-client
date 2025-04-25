import { User } from '@/lib/types/User';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthenticateRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  token: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface RenewVerificationRequest {
  email: string;
}

export interface OAuthRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
}

export interface AuthResponse {
  code: number;
  message: string;
  result: {
    id: string;
    email: string;
    accessToken: string;
    authenticated: boolean;
  };
}

export interface RegisterResponse {
  code: number;
  message: string;
  result: User;
}



export interface CheckUserResponse {
  code: number;
  message: string;
  result: User;
}

// Định nghĩa kiểu dữ liệu cho state
export interface AuthState {
  user: User | null;
  token: string | null;
  authenticated: boolean;
  verify: boolean;
  loading: boolean;
  error: string | null;
}
