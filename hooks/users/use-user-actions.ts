import { mutate } from 'swr';
import { toast } from 'sonner';
import { useState } from 'react';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { ModalState } from '@/types/interfaces/modal';
import { ActionType, CustomError, ErrorResponseData } from '@/types';

const useUserActions = (token: string) => {

  const [modalState, setModalState] = useState<ModalState>({
    userId: '',
    userName: '',
    userRole: '',
    isOpen: false,
    isLoading: false,
    actionType: 'delete',
  });

  const invalidateUsersCache = () => {
    mutate(
      (key) => Array.isArray(key) && key[0] === '/users',
      undefined,
      { revalidate: true }
    );
  };

  const openModal = (
    actionType: ActionType,
    userId: string,
    userName: string,
    userRole?: string,
    isActive?: boolean
  ) => {
    setModalState({
      userId,
      userName,
      userRole,
      isActive,
      actionType,
      isOpen: true,
      isLoading: false,
    });
  };

  const closeModal = () => {
    if (!modalState.isLoading) {
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const executeAction = async () => {
    if (!token) return;

    setModalState((prev) => ({ ...prev, isLoading: true }));

    try {
      let successMessage = '';

      switch (modalState.actionType) {
        case 'delete':
          await axios.delete(`${BASE_URL}/users/${modalState.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          successMessage = `${modalState.userName} has been deleted successfully`;
          break;

        case 'changeRole':
          const newRole = modalState.userRole?.toLowerCase() === 'admin' ? 'user' : 'admin';
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/role`,
            { role: newRole },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          successMessage = `${modalState.userName}'s role has been changed successfully`;
          break;

        case 'toggleActivation':
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/toggle-activation`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const action = modalState.isActive ? 'suspended' : 'activated';
          successMessage = `${modalState.userName} has been ${action} successfully`;
          break;

        default:
          throw new Error('Invalid action type');
      }

      toast.success(successMessage, {
        description: 'The user list will be refreshed automatically',
        duration: 4000,
      });

      invalidateUsersCache();
      closeModal();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );

      toast.error('Action Failed', {
        description: message,
        duration: 5000,
      });

      setModalState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const deleteUser = (userId: string, userName: string) => {
    openModal('delete', userId, userName);
  };

  const toggleUserActivation = (userId: string, userName: string, isActive: boolean) => {
    openModal('toggleActivation', userId, userName, undefined, isActive);
  };

  const updateUserRole = (userId: string, userName: string, currentRole: string) => {
    openModal('changeRole', userId, userName, currentRole);
  };

  return {
    deleteUser,
    modalState,
    closeModal,
    executeAction,
    updateUserRole,
    toggleUserActivation,
  };
};

export default useUserActions;
