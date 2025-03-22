'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { User, AuthState } from '@/lib/type/auth';
import useRoles from '../../redux/features/roles/useRole';

interface AuthContextType extends AuthState {
  hasPermission: (permissionName: string) => boolean;
  hasRole: (roleName: string) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    roles: [],
    isLoading: true,
    error: null,
  });
  const { loadRoles, roles } = useRoles();
  useEffect(() => {
    loadRoles();
  }, []);

  const refreshUserData = async () => {
    if (!session?.user) return;

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const user: User = {
        id: session.user.id as string,
        username: session.user.name as string,
        email: session.user.email as string,
        scope: (session.user.scope as unknown as string[]) || [],
      };

      setAuthState({
        user,
        roles,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        roles: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Không thể lấy dữ liệu người dùng',
      });
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    if (status === 'unauthenticated') {
      setAuthState({
        user: null,
        roles: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    refreshUserData();
  }, [session, status]);

  const hasPermission = (permissionName: string): boolean => {
    if (!authState.user || !authState.user.scope || authState.user.scope.length === 0) return false;
    return authState.user.scope.includes(permissionName);
  };

  const hasRole = (roleName: string): boolean => {
    if (!authState.user || !authState.user.scope || authState.user.scope.length === 0) return false;
    return authState.user.scope.includes(`ROLE_${roleName}`);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        hasPermission,
        hasRole,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
}
