'use client';

import { useAuth } from '@/lib/utils/auth/auth-provider';

export function usePermissions() {
  const { hasPermission, hasRole } = useAuth();

  const can = (permission: string): boolean => {
    return hasPermission(permission);
  };

  const is = (roleName: string): boolean => {
    return hasRole(roleName);
  };

  const canAny = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const canAll = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    can,
    is,
    canAny,
    canAll,
  };
}
