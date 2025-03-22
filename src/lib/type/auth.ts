// Types for authentication and authorization

export interface User {
  id: string;
  username: string;
  email: string;
  scope: string[];
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  scope: string[];
  exp: number;
}
