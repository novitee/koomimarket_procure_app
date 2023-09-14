import {View, Text, Image} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';

export default function DoneOrderScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {order} = route.params || {};
  const {supplierInfo, deliveryDate, orderNo, orderedAt, lineItems} =
    order || {};
  const supplierName = supplierInfo?.name;
  return (
    <View className="bg-primary/30 flex-1  overflow-hidden">
      <Container containerClassName="bg-transparent" className="bg-transparent">
        <Text className="text-30 text-center font-medium">You order to</Text>
        <Text className="text-30 text-center font-semibold text-primary uppercase">
          {supplierName}
        </Text>
        <Text className="text-30 text-center font-medium">has been sent</Text>
        <View className="flex-row justify-center items-center mt-5">
          {Array.from({length: 3}).map((_, index) => (
            <Image
              key={index}
              source={require('assets/images/order.png')}
              className="w-[200px] h-[200px]"
            />
          ))}
        </View>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-xl border border-gray-900 py-4 px-3">
            <View className="flex-row justify-between py-3">
              <Text className="text-20 text-primary font-bold mb-4">
                Order Summary
              </Text>
              <Text className="text-20 text-primary font-bold mb-4">
                {orderNo}
              </Text>
            </View>
            <View className="flex-row justify-between py-3 ">
              <Text className="font-medium">
                {dayjs(orderedAt).format('DD/MM/YYYY')}
              </Text>
            </View>
            <View className="flex-row justify-between py-3 border-t border-gray-900">
              <Text className="font-medium">Delivery Date</Text>
              <Text className="font-medium">
                {dayjs(deliveryDate).format('DD/MM/YYYY (ddd)')}
              </Text>
            </View>
            <View className="flex-row  justify-between py-3 border-t border-gray-900">
              <Text className="font-medium">Products ordered</Text>
              <Text className="font-medium">{lineItems.length}</Text>
            </View>
          </View>
        </View>
        <Button
          className="mt-8"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'SupplierTabs'}],
            })
          }>
          Done
        </Button>
      </Container>
    </View>
  );
}
