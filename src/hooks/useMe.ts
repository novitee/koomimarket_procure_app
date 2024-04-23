import {ROLE_BUYER} from './../configs/index';
import useNavigation from 'hooks/useNavigation';
import useQuery from 'libs/swr/useQuery';
import {useCallback, useEffect} from 'react';
import {getState} from 'stores/app';
import {resetAuthData} from 'utils/auth';
import {useModal} from 'libs/modal';

export default function useMe() {
  const {showModal, closeModal} = useModal();
  const navigation = useNavigation();
  const {
    data: userInfo,
    isLoading,
    mutate: refreshUser,
  } = useQuery('me', {
    immutable: true,
    onError(err) {
      const {authStatus, authToken} = getState();
      const {statusCode} = err;

      if (statusCode === 401 && authToken && authStatus !== 'REGISTERING') {
        resetAuthData();
        navigation.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        });
      }
    },
  });

  useEffect(() => {
    if (userInfo?.deleted) {
      showModal({
        title: 'Account Deleted',
        message:
          'Description: We are sorry to see you go. Your account has been deleted. You will be logged out instantly from this app.',
        onConfirm: () => {
          resetAuthData();
          closeModal();
        },
        modifiers: {
          confirmTitle: 'OK',
        },
      });
    }
  }, [userInfo]);

  const refresh = useCallback(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isAuth: !!userInfo,
    isBuyer:
      !!userInfo &&
      userInfo.me?.roleDepartments &&
      userInfo.me?.roleDepartments.includes(ROLE_BUYER),
    refresh,
    user: userInfo,
    isUserLoading: isLoading,
  };
}
