import React, {useCallback, useReducer, useEffect, useMemo} from 'react';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Container from 'components/Container';
import Text from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SearchBar from 'components/SearchBar';
import {toCurrency} from 'utils/format';
import useQuery from 'libs/swr/useQuery';
import useSearch from 'hooks/useSearch';
import useMutation from 'libs/swr/useMutation';
import {useGlobalStore} from 'stores/global';
import ToggleUpdateProduct from './ToggleUpdateProduct';
import OrderItem from './OrderItem';
import useCart from 'hooks/useCart';
import Loading from 'components/Loading';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import Toast from 'react-native-simple-toast';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

function useQueryCartItems({supplierId = '', searchString = ''}) {
  const url = 'get-cart-items';
  const params = {
    first: 20,
    skip: 0,
    orderBy: {
      createdAt: 'desc',
    },
    filter: {supplierId},
    searchString,
    include: 'photos(url,signedKey)',
    fields:
      'id,name,pricing,uom,procureQty,minOfQty,slug,productType,allowDecimalQuantity',
  };
  return useQuery([url, params]);
}

function useQuerySupplier(id: string) {
  const url = `suppliers/${id}`;
  const params = {
    fields: 'id,minOrder,name',
  };
  return useQuery([url, params]);
}

function NewOrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {} = useCart();
  const channel = useGlobalStore(state => state.currentChannel);
  const {supplierId} = channel || {};
  const {data: dataSupplier, isLoading} = useQuerySupplier(supplierId);
  const {company: supplier} = dataSupplier || {};
  const {searchString, handleSearch} = useSearch();
  const {data, mutate: refreshCartItems} = useQueryCartItems({
    supplierId,
    searchString,
  });
  const {records} = data || {};
  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const [values, dispatch] = useReducer(reducer, {
    render: false,
    selectedItem: {},
    cartDetails: [],
  });

  useEffect(() => {
    if (records && records.length > 0) {
      const cartDetails = records.map((item: any) => {
        return {
          productId: item.id,
          qty: item.procureQty,
          pricing: item.pricing,
          uom: item.uom,
        };
      });
      dispatch({cartDetails});
    }
  }, [records]);
  const {selectedItem, cartDetails} = values;

  const [{loading}, generateCheckoutCart] = useMutation({
    url: 'generate-checkout-cart',
  });

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        if (searchString) {
          handleSearch('');
        } else {
          refreshCartItems();
        }
      }
    }, [isFocused]),
  );

  const toAddProduct = useCallback((isManual = false) => {
    if (isManual) {
      navigation.navigate('AddingProductType', {
        supplierId,
      });
    } else {
      navigation.navigate('ProductCatalogue', {
        supplierId,
      });
    }
  }, []);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <IllustrationIcon />
        {!searchString ? (
          <>
            <Text className="font-bold mt-4 text-center">No products yet</Text>
            <Text className="font-light mt-4 text-center">
              Add products to your order list to get started.
            </Text>
          </>
        ) : (
          <>
            <Text className="font-bold mt-4 text-center">
              No matched result
            </Text>
            <Text className="font-light mt-4 text-center">
              Alternatively, add products from seller’s catalogue.
            </Text>
          </>
        )}

        <Button className="mt-4" onPress={() => toAddProduct()}>
          Add Products
        </Button>
      </View>
    );
  }, [toAddProduct, searchString]);

  const handleChangeItem = useCallback(
    ({item, qty, currentCartDetails}: any) => {
      const newItem = {
        productId: item.id,
        qty,
        pricing: item.pricing,
        uom: item.uom,
      };

      const findIndex = currentCartDetails.findIndex(
        (cartDetail: any) => cartDetail.productId === item.id,
      );
      let newCartDetails = [];
      if (findIndex === -1) {
        newCartDetails = [...currentCartDetails, newItem];
      } else {
        newCartDetails = currentCartDetails.map((cartDetail: any) =>
          cartDetail.productId === item.id ? newItem : cartDetail,
        );
      }

      dispatch({cartDetails: newCartDetails});
    },
    [],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OrderItem
          item={item}
          onEdit={() => dispatch({selectedItem: item})}
          onPress={(value: number) =>
            handleChangeItem({
              item,
              qty: value,
              currentCartDetails: cartDetails,
            })
          }
          supplierId={supplierId}
        />
      );
    },
    [handleChangeItem, cartDetails],
  );

  const handleClose = useCallback(
    (refresh = false) => {
      dispatch({
        selectedItem: {},
      });
      if (refresh) {
        refreshCartItems();
      }
    },
    [refreshCartItems],
  );

  const handleCheckoutCart = useCallback(async () => {
    const {data, error, success, message} = await generateCheckoutCart({
      supplierId,
      items: cartDetails,
    });
    if (success) {
      navigation.navigate('FinalizeOrder', {
        billingCartId: data.billingCart?.id,
        supplier,
      });
    } else {
      const {message, details} = error || {};
      let errorMessage = details ? Object.values(details)[0] : message;
      Toast.show(errorMessage, Toast.LONG);
    }
  }, [generateCheckoutCart, cartDetails]);

  const minOrderAmount = supplier?.minOrder;

  const allowCheckout =
    cartDetails.length > 0 && cartDetails.some((item: any) => item.qty > 0);

  const estimatedTotal = useMemo(
    () =>
      cartDetails.reduce((accumulator: any, currentValue: any) => {
        return accumulator + currentValue.qty * currentValue.pricing;
      }, 0),
    [cartDetails],
  );

  return (
    <>
      <Container className="pt-4 px-0">
        <SearchBar
          className="px-5"
          onSearch={handleSearch}
          defaultValue={searchString}
        />
        {!!records && records.length > 0 && (
          <View className="mt-5">
            <TouchableOpacity
              className="flex-row justify-between items-center mx-5 py-4 px-2 border-t border-gray-D4D4D8"
              onPress={() => toAddProduct(true)}>
              <Text className="font-semibold text-primary">
                Add Product Manually
              </Text>
              <ChevronRightIcon
                width={20}
                height={20}
                color={colors.primary.DEFAULT}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-between items-center mx-5 mb-4 py-4 px-2 border-y border-gray-D4D4D8"
              onPress={() => toAddProduct()}>
              <Text className="font-semibold text-primary">
                Browse Catalogue
              </Text>
              <ChevronRightIcon
                width={20}
                height={20}
                color={colors.primary.DEFAULT}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-primary font-bold text-2xl">
                My Order List
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ManageOrderList', {
                    supplierId,
                  })
                }>
                <Text className="text-primary">Manage List</Text>
              </TouchableOpacity>
            </View>
            {minOrderAmount > 0 && (
              <View className="bg-gray-100 px-5 py-3 mt-4">
                <Text className="font-medium">{`Minimum Order Amount: ${toCurrency(
                  minOrderAmount,
                  'SGD',
                )}`}</Text>
                <Text className="text-xs text-gray-500 leading-none mt-1">
                  If orders placed are less than the minimum order value for
                  this supplier, additional fees may be incurred.
                </Text>
              </View>
            )}
          </View>
        )}
        <KeyboardAvoidingView>
          <FlatList
            keyExtractor={_keyExtractor}
            contentContainerStyle={
              !!records && records.length > 0
                ? styles.flatListContentStyle
                : styles.flatListEmptyStyle
            }
            renderItem={_renderItem}
            data={(records || []).sort(
              (a: any, b: any) => b.updatedAt - a.updatedAt,
            )}
            extraData={records.sort(
              (a: any, b: any) => b.updatedAt - a.updatedAt,
            )}
            ListEmptyComponent={isLoading ? null : EmptyComponent}
            ItemSeparatorComponent={_renderItemSeparator}
            ListFooterComponent={_renderItemSeparator}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshCartItems}
              />
            }
          />
        </KeyboardAvoidingView>

        {(records || []).length > 0 && (
          <View className="bg-white px-5 pt-2">
            <Text className="font-semibold">
              Estimated Order Total: {toCurrency(estimatedTotal, 'SGD')}
            </Text>
            <Text className="text-sm font-light mt-2 mb-2">
              This is an estimated pricing. For the final pricing, please refer
              to the invoice.
            </Text>
            <Button
              disabled={
                !allowCheckout || loading || estimatedTotal < minOrderAmount
              }
              onPress={handleCheckoutCart}>
              Next
            </Button>
          </View>
        )}
      </Container>
      <ToggleUpdateProduct
        isOpen={!!selectedItem?.name}
        supplierId={supplierId}
        item={selectedItem}
        onClose={handleClose}
      />
      {isLoading && <Loading />}
    </>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    paddingBottom: 20,
  },
  flatListEmptyStyle: {
    flex: 1,
  },
});

export default NewOrderScreen;
