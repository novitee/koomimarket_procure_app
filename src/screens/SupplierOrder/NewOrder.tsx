import React, {useCallback, useReducer, useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Container from 'components/Container';
import Text from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SearchBar from 'components/SearchBar';
import Counter from 'components/Counter';
import {toCurrency} from 'utils/format';
import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import useQuery from 'libs/swr/useQuery';
import useSearch from 'hooks/useSearch';
import useMutation from 'libs/swr/useMutation';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import {useGlobalStore} from 'stores/global';
function useQueryCartItems({
  supplierId = '',
  searchString = '',
  categoryFilter = [],
}) {
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

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function ToggleUpdateProduct({
  isOpen,
  supplierId,
  item,
  onClose,
}: {
  isOpen: boolean;
  supplierId: string;
  item: any;
  onClose: (refresh?: boolean) => void;
}) {
  const [pricing, setPricing] = useState(item?.pricing);

  const [{loading}, updateItem] = useMutation({
    method: 'PATCH',
    url: `update-item/${item?.slug}`,
  });

  const handleUpdate = useCallback(async () => {
    const {data} = await updateItem({
      supplierId: supplierId,
      product: {
        pricing,
      },
    });
    onClose(true);
  }, [updateItem]);

  return (
    <BottomSheet isOpen={isOpen} contentHeight={400}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-10">
            <Text className="text-primary font-semibold text-xl text-center">{`Edit ${item?.name} price`}</Text>
          </View>
          <View className="flex-row justify-between mt-10">
            <View className="flex-1">
              <Text className="font-semibold mb-3">Original</Text>
              <Text className="mt-3">
                $ {`${item?.pricing} ${item.uom?.toUpperCase()}`} (S)
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold mb-3">Update to</Text>
              <Input
                keyboardType="decimal-pad"
                className="rounded-lg"
                StartComponent={() => (
                  <View className="flex-row items-center ml-2">
                    <Text className="text-gray-500 text-center ">$</Text>
                  </View>
                )}
                value={pricing}
                onChangeText={setPricing}
              />
            </View>
          </View>
        </View>

        <View className="flex-row">
          <Button
            variant="outline"
            onPress={() => onClose()}
            className="flex-1">
            Cancel
          </Button>
          <Button onPress={handleUpdate} className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

function OrderItem({
  item,
  onEdit,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
  onEdit?: TouchableOpacityProps['onPress'];
}) {
  return (
    <View className="flex-row items-center justify-between rounded-lg p-5">
      <View>
        <Text className="text-sm font-bold ">{item.name}</Text>
        <TouchableOpacity
          className="p-2 bg-primary rounded mt-2"
          onPress={onEdit}>
          <Text className="text-white">
            {`${toCurrency(item.pricing, 'USD')} ${item.uom?.toUpperCase()}`}{' '}
            (S)
          </Text>
        </TouchableOpacity>
      </View>
      <Counter defaultValue={1} onChange={() => {}} />
    </View>
  );
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

function NewOrderScreen({navigation}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    selectedItem: {},
  });

  const channel = useGlobalStore(state => state.currentChannel);
  const {supplierId} = channel || {};

  const minOrderAmount = 150;

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

  const {selectedItem} = values;
  const {searchString, handleSearch} = useSearch();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      handleSearch('');
    }
  }, [isFocused]);

  const {data, mutate: refreshCartItems} = useQueryCartItems({
    supplierId,
    searchString,
  });

  const toAddProduct = useCallback(() => {
    navigation.navigate('ProductCatalogue', {supplierId});
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

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OrderItem
          item={item}
          onEdit={() => handleEdit(item)}
          onPress={() => {}}
        />
      );
    },
    [handleEdit],
  );
  const handleClose = useCallback(
    (refresh = false) => {
      dispatch({
        selectedItem: {},
        render: true,
      });
      if (refresh) refreshCartItems();
    },
    [dispatch, refreshCartItems],
  );

  const {records} = data || {};

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
                onPress={() => navigation.navigate('ManageOrderList')}>
                <Text className="text-primary">Manage List</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-gray-100 px-5 py-4 mt-4">
              <Text className="font-medium">{`Minimum Order Amount: ${toCurrency(
                minOrderAmount,
                'USD',
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
      </Container>
      <ToggleUpdateProduct
        isOpen={!!selectedItem?.name}
        supplierId={supplierId}
        item={selectedItem}
        onClose={handleClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});

export default NewOrderScreen;
