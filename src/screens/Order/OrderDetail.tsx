import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableOpacityProps,
} from 'react-native';
import React, {createRef, useLayoutEffect, useState} from 'react';
import PagerView, {
  PagerViewOnPageSelectedEventData,
} from 'react-native-pager-view';
import Container from 'components/Container';
import {DirectEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import Text from 'components/Text';
import clsx from 'libs/clsx';
import LineButton from 'components/LineButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import StatusBadge from 'components/StatusBadge';
import dayjs from 'dayjs';
import Button from 'components/Button';
import {BackButton} from 'navigations/common';

const tabs = [
  {
    id: 'items_ordered',
    label: 'Items Ordered',
  },
  {
    id: 'comments',
    label: 'Comments',
  },
  {
    id: 'details',
    label: 'Details',
  },
];

const dummyData = [
  {id: 1, name: 'Carrot', price: 0.99, unit: 'KG', quantity: 1},
  {id: 2, name: 'Tomato', price: 1.49, unit: 'KG', quantity: 1},
  {id: 3, name: 'Broccoli', price: 1.99, unit: 'KG', quantity: 2},
  {id: 4, name: 'Spinach', price: 0.89, unit: 'KG', quantity: 2},
];

const HeaderLeft = ({
  supplierName,
  goBack,
}: {
  supplierName: string;
  goBack?: () => void;
}) => {
  return (
    <View className="flex-row items-center">
      <BackButton canGoBack goBack={goBack} />
      <View className="ml-2">
        <Text className="text-sm font-semibold">Order</Text>
        <Text className="text-sm">{supplierName}</Text>
      </View>
    </View>
  );
};
export default function OrderDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const pageViewRef = createRef<PagerView>();
  const [selectedPage, setSelectedPage] = useState(0);

  const {order} = route.params || {};
  const {comments, status, orderedAt, deliveryDate, products, supplier} =
    order || {};

  useLayoutEffect(() => {
    if (supplier) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <HeaderLeft supplierName={supplier.name} goBack={navigation.goBack} />
        ),
      });
    }
  }, [supplier, navigation]);

  const orderSummary: Record<string, any> = [
    ['Status', status],
    ['Order Date', dayjs(orderedAt).format('DD/MM/YYYY')],
    ['Delivery Date', dayjs(deliveryDate).format('DD/MM/YYYY (ddd)')],
    ['Products ordered', products.length],
    ['Estimated Order Total', products.length],
  ];
  const orderDetails: Record<string, any> = [
    ['Order ID', 'KM00004562K'],
    ['Ordered By', 'Lee Zong Han'],
    ['Delivery Address', '17 Jln Mesin #05-605 Koomi Office'],
    ['Customer ID', '1011'],
  ];
  const onPageSelected: DirectEventHandler<
    PagerViewOnPageSelectedEventData
  > = ({nativeEvent: {position}}) => {
    setSelectedPage(position);
  };
  return (
    <Container className="px-0">
      <View className="flex-row">
        {tabs.map((tab, index: number) => (
          <TouchableOpacity
            onPress={() => pageViewRef.current?.setPage(index)}
            className={clsx({
              'flex-1 border-b-2 py-2': true,
              'border-primary': index === selectedPage,
              'border-gray-D4D4D8': index !== selectedPage,
            })}
            key={tab.id}>
            <Text className="text-center font-medium">{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <PagerView
        onPageSelected={onPageSelected}
        className={'flex-1'}
        ref={pageViewRef}
        initialPage={0}>
        <ScrollView
          key={0}
          className="flex-1"
          contentContainerStyle={styles.scrollViewContent}>
          <LineButton
            onPress={() => navigation.navigate('AddingProductType')}
            className="border-t border-gray-D4D4D8">
            Repeat Order
          </LineButton>
          {dummyData.map((item: any, index: number) => (
            <View
              className="flex-row items-center py-6 border-b border-gray-400"
              key={index}>
              <Text className="text-30 font-bold w-16 text-center">
                {item.quantity}
              </Text>
              <View className="flex-1">
                <Text className="font-bold">{item.name}</Text>
                <Text className="font-light mt-2">{item.unit}</Text>
              </View>
            </View>
          ))}
          <View className="px-4">
            <Text className="mt-6 font-bold">Estimated Order Total:</Text>
            <Text className="text-sm font-light mt-2">
              KoomiMarket does not guarantee the accuracy of prices and does not
              assume liability for errors.
            </Text>
          </View>
        </ScrollView>
        <View key={1} className="p-4">
          <Text>{comments}</Text>
        </View>
        <ScrollView
          key={2}
          className="flex-1 p-4"
          contentContainerStyle={styles.scrollViewContent}>
          <View className="border border-gray-900 rounded-xl px-3 divide-y divide-gray-900">
            {orderSummary.map(([label, value]: any) => {
              return (
                <View
                  key={label}
                  className="flex-row items-center justify-between py-4">
                  <Text className="font-semibold">{label}</Text>
                  {label === 'Status' ? (
                    <StatusBadge status={value} />
                  ) : (
                    <Text className="font-semibold">{value}</Text>
                  )}
                </View>
              );
            })}
          </View>
          <View>
            {orderDetails.map(([label, value]: any) => {
              return (
                <View key={label} className="mt-4">
                  <Text className="font-semibold">{label}</Text>
                  <Text className="mt-1 text-sm">{value}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </PagerView>
      <View className="px-5">
        <Button onPress={() => navigation.navigate('GoodsReceiving')}>
          I have received the order
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 40,
  },
});
