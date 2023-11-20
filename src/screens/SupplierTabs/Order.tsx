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
import IssueIcon from 'assets/images/issue.svg';
import SearchBar from 'components/SearchBar';
import useSearch from 'hooks/useSearch';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {BackButton} from 'navigations/common';
import Loading from 'components/Loading';
import clsx from 'libs/clsx';
import {ORDER_STATUS} from 'utils/constants';
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

const convertFilter = (params: any) => {
  const {listFilteredBy, filteredBy} = params || {};
  let filter = {};
  if (filteredBy !== 'ALL') {
    if (filteredBy === 'COMPLETED') {
      filter = {
        ...filter,
        status_in: [ORDER_STATUS['completed'], ORDER_STATUS['resolved']],
      };
    } else {
      filter = {
        ...filter,
        status:
          filteredBy === 'COMPLETED' ? ORDER_STATUS['completed'] : filteredBy,
      };
    }
  }

  if (listFilteredBy !== 'ALL_ORDERS') {
    let now = dayjs();
    filter = {
      ...filter,
      status_ne: ORDER_STATUS['completed'],
      deliveryDate_gte: now.startOf('day').valueOf(),
      deliveryDate_lte: now.endOf('day').valueOf(),
    };
  }
  return filter;
};

const convertOrderBy = (params: any) => {
  const {filteredBy} = params || {};
  if (['ALL', 'COMPLETED', 'RESOLVING'].includes(filteredBy)) {
    return {
      updatedAt: 'desc',
      orderedAt: 'desc',
    };
  } else {
    return {
      orderedAt: 'desc',
    };
  }
};

function OrderItem({
  item,
  onPress,
}: {
  item: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {supplier, status, lineItems, deliveryDate, orderedAt, resolvedAt} =
    item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" items-center rounded-lg border border-gray-D4D4D8 p-4 mb-4">
      <View className="flex-row">
        <Avatar size={40} name={supplier.name} url={supplier?.photo?.url} />
        <View className="flex-1 justify-start ml-2 mr-2 w-3/4 ">
          <Text className="font-bold text-16 ">{supplier.name}</Text>
          <Text className="text-14 text-gray-400">
            {`Ordered ${dayjs(orderedAt).format('ddd, DD MMM')}`}
          </Text>
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
      {status === 'COMPLETED' && (
        <View className="flex-row w-full items-center mt-3">
          <CheckIcon color={colors.green} className="w-6 h-6" />
          <Text className="text-14 text-[#16D66E] flex-shrink-0 truncate ml-2">
            Order received on {`${dayjs(deliveryDate).format('DD/MM/YYYY')}`},
            no issues
          </Text>
        </View>
      )}
      {status === 'RESOLVED' && (
        <View className="flex-row w-full items-center mt-3">
          <CheckIcon color={colors.green} className="w-6 h-6" />
          <Text className="text-14 text-[#16D66E] flex-shrink-0 truncate ml-2">
            Order received on {`${dayjs(deliveryDate).format('DD/MM/YYYY')}`},
            issue solved on {`${dayjs(resolvedAt).format('DD/MM/YYYY')}`}
          </Text>
        </View>
      )}
      {deliveryDate && status === 'RESOLVING' && (
        <View className="flex-row w-full items-center mt-3">
          <IssueIcon className="w-6 h-6" />
          <Text className="text-14 text-[#EAB308] flex-shrink-0 truncate ml-2">
            Order received on {`${dayjs(deliveryDate).format('DD/MM/YYYY')}`},
            with issues
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function useQueryOrders(searchString: string, filter: any, orderBy: any) {
  const url = 'orders';
  const params = {
    first: 100,
    skip: 0,
    fields:
      'id,orderNo,orderedAt,lineItems,status,deliveryDate,total,orderedAt',
    include: 'supplier(name,photo)',
    searchString,
    orderBy,
    filter,
  };
  return useQuery([url, params]);
}

const deliveryFilters = [
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
    value: ORDER_STATUS['sent'],
  },
  {
    label: 'Confirmed',
    value: ORDER_STATUS['confirmed'],
  },
  {
    label: 'Completed',
    value: ORDER_STATUS['completed'],
  },
  {
    label: 'Issue',
    value: ORDER_STATUS['issue'],
  },
];

export default function OrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {searchString, handleSearch} = useSearch();

  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const isFocused = useIsFocused();

  const [values, dispatch] = useReducer(reducer, {
    listFilteredBy: 'ALL_ORDERS',
    filteredBy: 'ALL',
  });

  const {listFilteredBy, filteredBy} = values;
  const {data, isLoading, mutate} = useQueryOrders(
    searchString,
    convertFilter(values),
    convertOrderBy(values),
  );
  const {records} = data || {};
  function reducer(state: any, action: any) {
    return {...state, ...action};
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

  const handleChangeListFilter = (value: string) => {
    dispatch({listFilteredBy: value, filteredBy: 'ALL'});
  };

  return (
    <Container>
      <SearchBar onSearch={handleSearch} />
      <View className="flex-row pt-4">
        {deliveryFilters.map((item, index) => (
          <View className="flex-1 items-center" key={index}>
            <TouchableOpacity
              onPress={() => handleChangeListFilter(item.value)}
              className={clsx({
                'py-1 border-b-2': true,
                'border-primary': listFilteredBy === item.value,
                'border-transparent': listFilteredBy !== item.value,
              })}>
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
      <View
        className={clsx({
          hidden: listFilteredBy === 'TODAY_RECEIVING',
        })}>
        <ScrollView horizontal className="py-3">
          {orderStatuses.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => dispatch({filteredBy: item.value})}
              className={clsx({
                'py-2 px-3 border mr-2 rounded-lg': true,
                'border-primary': filteredBy === item.value,
                'border-gray-9CA3AF': filteredBy !== item.value,
              })}>
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
