import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ScrollView,
} from 'react-native';
import React, {useCallback, useLayoutEffect, useReducer, useState} from 'react';
import Container from 'components/Container';
import ShippingIcon from 'assets/images/shipping.svg';
import useQuery from 'libs/swr/useQuery';
import Avatar from 'components/Avatar';
import {useGlobalStore} from 'stores/global';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import StatusBadge from 'components/StatusBadge';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import CheckIcon from 'assets/images/check.svg';
import SearchBar from 'components/SearchBar';
import useSearch from 'hooks/useSearch';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {BackButton} from 'navigations/common';
import Loading from 'components/Loading';
import clsx from 'libs/clsx';
function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function renderProductName(lineItems: any[]) {
  if (!lineItems) {
    return '';
  }
  if (lineItems?.length < 4) {
    return `${lineItems.map(p => p.name).join(', ')}`;
  } else {
    return `${lineItems
      .slice(0, 2)
      .map(p => p.name)
      .join(', ')} & ${lineItems?.length - 2} items`;
  }
}

function OrderItem({
  item,
  onPress,
}: {
  item: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {supplier, status, lineItems, deliveredAt} = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" items-center rounded-lg border border-gray-D4D4D8 p-4 mb-4">
      <View className="flex-row">
        <Avatar size={40} name={supplier.name} url={supplier?.photo?.url} />
        <View className="flex-1 justify-center ml-4 mr-2">
          <Text className="font-bold text-16 w-3/4">{supplier.name}</Text>
          <Text className="text-14 text-gray-400">{`Delivered by ${dayjs(
            deliveredAt,
          ).format('MM/DD/YYYY (ddd)')}`}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
      <View className="flex-row w-full items-center justify-between mt-3">
        <Text className="text-14 font-medium flex-shrink-0 truncate w-3/4">
          {renderProductName(lineItems)}
        </Text>
        <ChevronRightIcon
          className="rotate-180"
          color={colors.primary.DEFAULT}
        />
      </View>
      {deliveredAt && status === 'COMPLETED' && (
        <View className="flex-row w-full items-center mt-3">
          <Text className="text-14 text-red-500 flex-shrink-0 truncate mr-4">
            Order Received
          </Text>
          <CheckIcon color={colors.primary.DEFAULT} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function useQueryOrders(searchString: string) {
  const url = 'orders';
  const params = {
    first: 100,
    skip: 0,
    fields: 'id,orderNo,orderedAt,lineItems,status,deliveredAt,total',
    include: 'supplier(name,photo)',
    searchString,
    orderBy: {
      orderedAt: 'desc',
    },
  };
  return useQuery([url, params]);
}

const orderFilters = [
  {
    label: 'All Orders',
    value: 'ALL_ORDERS',
  },
  {
    label: "Today's Receiving",
    value: 'TODAY_RECEIVING',
  },
];

const orderStatuses = [
  {
    label: 'All',
    value: 'ALL',
  },
  {
    label: 'Sent',
    value: 'SENT',
  },
  {
    label: 'Confirmed',
    value: 'CONFIRMED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
  {
    label: 'Issue',
    value: 'ISSUE',
  },
];
export default function OrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {searchString, handleSearch} = useSearch();
  const {data, isLoading, mutate} = useQueryOrders(searchString);
  const {records} = data || {};
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const isFocused = useIsFocused();

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    listFilteredBy: 'ALL_ORDERS',
    filteredBy: 'ALL',
  });

  const {listFilteredBy, filteredBy} = values;

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

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        mutate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]),
  );

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <BackButton
            canGoBack
            goBack={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'MyOutlets'}],
              })
            }
          />
        ),
        headerTitle: currentOutlet?.name,
      });
    }
  }, [currentOutlet, navigation]);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <ShippingIcon />
        <Text className="font-bold mt-4 text-center">No orders yet</Text>
        <Text className="font-light mt-4 text-center">
          Add a supplier and start ordering now!
        </Text>
      </View>
    );
  }, []);

  const handlePressItem = useCallback(
    (item: any) => {
      navigation.navigate('OrderDetail', {orderNo: item.orderNo});
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return <OrderItem item={item} onPress={() => handlePressItem(item)} />;
    },
    [handlePressItem],
  );

  return (
    <Container>
      <SearchBar onSearch={handleSearch} />
      <View className="flex-row pt-4">
        {orderFilters.map(item => (
          <View className="flex-1 items-center">
            <TouchableOpacity
              onPress={() =>
                dispatch({render: true, listFilteredBy: item.value})
              }
              className={clsx({
                'py-1 border-b-2': true,
                'border-primary': listFilteredBy === item.value,
                'border-transparent': listFilteredBy !== item.value,
              })}
              key={item.value}>
              <Text
                className={clsx({
                  'font-semibold': true,
                  'text-primary': listFilteredBy === item.value,
                  'text-gray-400': listFilteredBy !== item.value,
                })}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View>
        <ScrollView horizontal className="py-3">
          {orderStatuses.map(item => (
            <TouchableOpacity
              onPress={() => dispatch({render: true, filteredBy: item.value})}
              className={clsx({
                'py-2 px-3 border mr-2 rounded-lg': true,
                'border-primary': filteredBy === item.value,
                'border-gray-9CA3AF': filteredBy !== item.value,
              })}
              key={item.value}>
              <Text
                className={clsx({
                  'font-semibold': true,
                  'text-primary': filteredBy === item.value,
                  'text-gray-400': filteredBy !== item.value,
                })}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        keyExtractor={_keyExtractor}
        className="flex-1"
        contentContainerStyle={
          !!records && records.length > 0
            ? styles.flatListContentStyle
            : styles.flatListEmptyStyle
        }
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={isLoading ? null : EmptyComponent}
      />
      {isLoading && <Loading />}
    </Container>
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
