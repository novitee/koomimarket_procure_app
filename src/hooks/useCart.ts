import useNavigation from 'hooks/useNavigation';
import useQuery from 'libs/swr/useQuery';
import {useCallback, useEffect} from 'react';
import {setState} from 'stores/app';
export default function useCart() {
  const navigation = useNavigation();
  const {
    data,
    isLoading,
    mutate: refreshCart,
  } = useQuery('get-current-cart', {
    onError(err) {
      const {statusCode} = err;

      if (statusCode === 401) {
        navigation.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        });
      }
    },
  });

  const {getCurrentCart: cart} = data || {};
  const {token, cartGroups = []} = cart || {};

  useEffect(() => {
    if (token) {
      setState({cartToken: token});
    }
  }, [token]);

  const cartItems = cartGroups.reduce((acc: any, group: any) => {
    return [
      ...acc,
      ...group.cartItems.map((item: any) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    ];
  }, []);

  const refresh = useCallback(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {cart, cartItems, isLoading, refresh};
}
