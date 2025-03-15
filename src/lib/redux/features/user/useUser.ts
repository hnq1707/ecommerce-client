import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  setUser,
  clearUser,
  UpdateUserRequest,
} from '@/lib/redux/features/user/userSlice';
import { User } from '@/lib/type/User';

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, user, loading, error } = useSelector((state: RootState) => state.user);

  const fetchAllUsers = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const fetchUser = useCallback(
    (userId: string) => {
      dispatch(fetchUserById(userId));
    },
    [dispatch],
  );

  const updateUserData = useCallback(
    (userId: string, userData: UpdateUserRequest) => {
      dispatch(updateUser({ userId, userData }));
    },
    [dispatch],
  );

  const removeUser = useCallback(
    (userId: string) => {
      dispatch(deleteUser(userId));
    },
    [dispatch],
  );

  const setUserState = useCallback(
    (userData: User) => {
      dispatch(setUser(userData));
    },
    [dispatch],
  );

  // Xóa user khỏi store
  const clearUserState = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  return useMemo(
    () => ({
      users,
      user,
      loading,
      error,
      fetchAllUsers,
      fetchUser,
      updateUserData,
      removeUser,
      setUserState,
      clearUserState,
    }),
    [
      users,
      user,
      loading,
      error,
      fetchAllUsers,
      fetchUser,
      updateUserData,
      removeUser,
      setUserState,
      clearUserState,
    ],
  );
};
