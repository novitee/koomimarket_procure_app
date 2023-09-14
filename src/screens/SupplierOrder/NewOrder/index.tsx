import React, {useCallback, useReducer, useState, useMemo} from 'react';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Container from 'components/Container';
import Text from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
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
    fields: 'id,minOrder',
  };
  return useQuery([url, params]);
}

function NewOrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {} = useCart();
  const [currentState, setCurrentState] = useState(0);

  const channel = useGlobalStore(state => state.currentChannel);

  const {supplierId} = channel || {};

  const {data: dataSupplier, isLoading} = useQuerySupplier(supplierId);
  const {company: supplier} = dataSupplier || {};

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const [values, dispatch] = useReducer(reducer, {
    render: false,
    selectedItem: {},
    cartDetails: [],
  });
  const {selectedItem, cartDetails} = values;
  const {searchString, handleSearch} = useSearch();

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

  const {data, mutate: refreshCartItems} = useQueryCartItems({
    supplierId,
    searchString,
  });

  const toAddProduct = useCallback(() => {
    navigation.navigate('ProductCatalogue', {
      supplierId,
    });
  }, [navigation]);

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

        <Button className="mt-4" onPress={toAddProduct}>
          Add Products
        </Button>
      </View>
    );
  }, [toAddProduct, searchString]);

  const handleEdit = useCallback((item: any) => {
    dispatch({
      selectedItem: item,
      render: true,
    });
  }, []);

  const handleChangeItem = useCallback(
    ({item, qty}: {item: any; qty: any}) => {
      const newItem = {
        productId: item.id,
        qty,
        uom: item.uom,
      };

      const findIndex = values.cartDetails.findIndex(
        (cartDetail: any) => cartDetail.productId === item.id,
      );
      let newCartDetails = [];
      if (findIndex === -1) {
        newCartDetails = [...values.cartDetails, newItem];
      } else {
        newCartDetails = values.cartDetails.map((cartDetail: any) =>
          cartDetail.productId === item.id ? newItem : cartDetail,
        );
      }

      dispatch({cartDetails: newCartDetails, render: true});
    },
    [dispatch, values.cartDetails],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OrderItem
          item={item}
          onEdit={() => handleEdit(item)}
          onPress={(value: number) =>
            handleChangeItem({
              item,
              qty: value,
            })
          }
          supplierId={supplierId}
        />
      );
    },
    [handleChangeItem, handleEdit, supplierId],
  );

  const handleClose = useCallback(
    (refresh = false) => {
      dispatch({
        selectedItem: {},
        render: true,
      });
      if (refresh) {
        refreshCartItems();
      }
    },
    [dispatch, refreshCartItems],
  );

  const {records} = data || {};

  const handleCheckoutCart = useCallback(async () => {
    const {data} = await generateCheckoutCart({
      supplierId,
      items: cartDetails,
    });
    if (data) {
      navigation.navigate('FinalizeOrder', {
        billingCartId: data.billingCart?.id,
      });
    }
  }, [generateCheckoutCart, cartDetails]);
  const minOrderAmount = supplier?.minOrder;
  const allowCheckout =
    cartDetails.length > 0 && cartDetails.some((item: any) => item.qty > 0);

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
            {/* <TouchableOpacity
              className="flex-row justify-between items-center mx-5 mb-4 px-2 py-2 border-y border-gray-D4D4D8"
              onPress={toAddProduct}>
              <Text className="font-semibold text-primary">
                Add Product Manually
              </Text>
              <ChevronRightIcon
                width={28}
                height={28}
                color={colors.primary.DEFAULT}
                strokeWidth={2}
              />
            </TouchableOpacity> */}
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
            <View className="bg-gray-100 px-5 py-4 mt-4">
              <Text className="font-medium">{`Minimum Order Amount: ${toCurrency(
                minOrderAmount,
                'SGD',
              )}`}</Text>
              <Text className="text-sm text-gray-500 leading-none mt-2">
                This supplier has a minimum order value. Additional costs may
                occur if orders are placed under this amount.
              </Text>
            </View>
          </View>
        )}
        <FlatList
          keyExtractor={_keyExtractor}
          contentContainerStyle={styles.flatListContentStyle}
          renderItem={_renderItem}
          data={records || []}
          extraData={records}
          ListEmptyComponent={EmptyComponent}
          ItemSeparatorComponent={_renderItemSeparator}
        />
        {(records || []).length > 0 && (
          <View className="bg-white px-5 pt-2">
            <Button
              disabled={!allowCheckout || loading}
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
    flex: 1,
  },
});

export default NewOrderScreen;
