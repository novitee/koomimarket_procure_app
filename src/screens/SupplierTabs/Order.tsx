import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
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
function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function renderProductName(lineItems: any[]) {
  if (!lineItems) return '';
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
  const {supplier, orderedAt, status, lineItems, deliveredAt} = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" items-center rounded-lg border border-gray-D4D4D8 p-4 mb-4">
      <View className="flex-row">
        <Avatar size={40} name={supplier.name} url={supplier?.photo?.url} />
        <View className="flex-1 justify-center ml-4 mr-2">
          <Text className="font-bold text-16 w-3/4">{supplier.name}</Text>
          <Text className="text-14 text-gray-400">{`Ordered ${dayjs(
            orderedAt,
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
export default function OrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {searchString, handleSearch} = useSearch();
  const {data, isLoading, mutate} = useQueryOrders(searchString);
  const {records} = data || {};
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const isFocused = useIsFocused();

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
        headerLeft: () => <BackButton canGoBack goBack={navigation.goBack} />,
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
      {/* <TouchableOpacity
        onPress={() => {}}
        className="flex-row justify-between items-center mt-8 border-y p-3 border-gray-300">
        <Text className="font-bold text-primary">Check Due Invoices</Text>
        <ChevronRightIcon
          className="rotate-180"
          color={colors.primary.DEFAULT}
        />
      </TouchableOpacity> */}
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
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
    flex: 1,
  },
});
