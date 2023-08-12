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

const dummyData = [
  {
    id: 1,
    orderedAt: '2022-01-01',
    deliveryDate: '2022-01-01',
    status: 'SENT',
    comments: 'Call me when reach.',
    supplier: {
      name: 'Vegetable Farm',
    },
    products: [
      {
        id: 1,
        name: 'Carrot',
        price: 0.99,
        unit: 'KG',
        quantity: 1,
      },
      {
        id: 2,
        name: 'Broccoli',
        price: 1.5,
        unit: 'KG',
        quantity: 2,
      },
    ],
  },
  {
    id: 2,
    deliveryDate: '2022-01-01',
    orderedAt: '2022-01-02',
    status: 'CONFIRMED',
    comments: 'Call me when reach.',
    supplier: {
      name: 'Fruit Orchard',
    },
    products: [
      {
        id: 3,
        name: 'Apple',
        price: 1.5,
        unit: 'KG',
        quantity: 2,
      },
      {
        id: 4,
        name: 'Banana',
        price: 0.99,
        unit: 'KG',
        quantity: 3,
      },
    ],
  },
  {
    id: 3,
    orderedAt: '2022-01-03',
    deliveryDate: '2022-01-01',
    status: 'ISSUE',
    comments: 'Call me when reach.',
    supplier: {
      name: 'Dairy Farm',
    },
    products: [
      {
        id: 5,
        name: 'Milk',
        price: 2.99,
        unit: 'L',
        quantity: 1,
      },
      {
        id: 6,
        name: 'Cheese',
        price: 3.5,
        unit: 'KG',
        quantity: 2,
      },
    ],
  },
  {
    id: 4,
    orderedAt: '2022-01-04',
    deliveryDate: '2022-01-01',
    status: 'CANCELLED',
    comments: 'Call me when reach.',
    supplier: {
      name: 'Bakery',
    },
    products: [
      {
        id: 7,
        name: 'Bread',
        price: 3.5,
        unit: 'loaf',
        quantity: 3,
      },
      {
        id: 8,
        name: 'Croissant',
        price: 1.99,
        unit: 'piece',
        quantity: 5,
      },
      {
        id: 9,
        name: 'Egg',
        price: 1.99,
        unit: 'unit',
        quantity: 5,
      },
      {
        id: 10,
        name: 'Carrot',
        price: 1.99,
        unit: 'unit',
        quantity: 5,
      },
    ],
  },
];

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function renderProductName(products: any[]) {
  if (products.length < 4) {
    return `${products.map(p => p.name).join(', ')}`;
  } else {
    return `${products
      .slice(0, 2)
      .map(p => p.name)
      .join(', ')} & ${products.length - 2} items`;
  }
}

function OrderItem({
  item,
  onPress,
}: {
  item: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {supplier, orderedAt, status, products} = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" items-center rounded-lg border border-gray-D4D4D8 p-4 mb-4">
      <View className="flex-row">
        <Avatar size={40} name={supplier.name} />
        <View className="flex-1 justify-center ml-4 mr-2">
          <Text className="font-bold text-16">{supplier.name}</Text>
          <Text className="text-14 text-gray-400">{`Ordered ${dayjs(
            orderedAt,
          ).format('MM/DD/YYYY (ddd)')}`}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
      <View className="flex-row w-full items-center justify-between mt-3">
        <Text className="text-14 font-medium">{`${renderProductName(
          products,
        )}`}</Text>
        <ChevronRightIcon
          className="rotate-180"
          color={colors.primary.DEFAULT}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function OrderScreen({navigation}: NativeStackScreenProps<any>) {
  const {} = useQuery('');
  // const records: any = [];
  const records = dummyData;
  const currentOutlet = useGlobalStore(state => state.currentOutlet);

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({headerTitle: currentOutlet?.name});
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
      navigation.navigate('OrderDetail', {order: item});
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
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});
