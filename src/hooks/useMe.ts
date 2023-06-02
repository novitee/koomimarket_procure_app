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
      const authToken = getState().authToken || '';
      const {code} = err;

      if (code === 401 && authToken) {
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
    refresh,
    user: userInfo,
    isUserLoading: isLoading,
  };
}
