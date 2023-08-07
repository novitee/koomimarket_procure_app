import {ROLE_BUYER} from './../configs/index';
import useNavigation from 'hooks/useNavigation';
import useQuery from 'libs/swr/useQuery';
import {useCallback} from 'react';
import {getState} from 'stores/app';
import {resetAuthData} from 'utils/auth';

export default function useMe() {
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
