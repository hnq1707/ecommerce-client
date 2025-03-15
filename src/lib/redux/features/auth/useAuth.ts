import { useCallback, useMemo } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  registerUser,
  authenticateUser,
  logoutUser,
  verifyCode,
  checkUser,
  renewVerificationCode,
} from '@/lib/redux/features/auth/authSlice';
import {
  AuthenticateRequest,
  RegisterRequest,
  VerifyRequest,
  RenewVerificationRequest,
  OAuthRegistrationRequest,
} from '@/lib/redux/features/auth/authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const register = useCallback(
    (data: RegisterRequest) => dispatch(registerUser(data)).unwrap(),
    [dispatch],
  );

  const login = useCallback(
    (data: AuthenticateRequest) => dispatch(authenticateUser(data)).unwrap(),
    [dispatch],
  );

  const logout = useCallback(
    (token: string) => dispatch(logoutUser({ token })).unwrap(),
    [dispatch],
  );

  const verify = useCallback(
    (data: VerifyRequest) => dispatch(verifyCode(data)).unwrap(),
    [dispatch],
  );

  const checkOAuthUser = useCallback(
    (data: OAuthRegistrationRequest) => dispatch(checkUser(data)).unwrap(),
    [dispatch],
  );

  const renewVerification = useCallback(
    (data: RenewVerificationRequest) => dispatch(renewVerificationCode(data)).unwrap(),
    [dispatch],
  );

  return useMemo(
    () => ({
      register,
      login,
      logout,
      verify,
      checkOAuthUser,
      renewVerification,
    }),
    [register, login, logout, verify, checkOAuthUser, renewVerification],
  );
};
