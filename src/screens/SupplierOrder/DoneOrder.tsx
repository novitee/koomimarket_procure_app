import {View, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Container from 'components/Container';
import colors from 'configs/colors';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';

export default function DoneOrderScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const supplierName = 'Vegetable Farm';
  const {requestedDeliveryDate, productsOrdered} = route.params || {};

  return (
    <View className="bg-primary/30 flex-1">
      <Container containerClassName="bg-transparent" className="bg-transparent">
        <Text className="text-30 text-center font-medium">You order to</Text>
        <Text className="text-30 text-center font-semibold text-primary uppercase">
          {supplierName}
        </Text>
        <Text className="text-30 text-center font-medium">has been sent</Text>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-xl border border-gray-900 py-4 px-3">
            <Text className="text-20 text-primary font-bold mb-4">
              Order Summary
            </Text>
            <View className="flex-row justify-between py-3 border-t border-gray-900">
              <Text className="font-medium">Delivery Date</Text>
              <Text className="font-medium">
                {dayjs(requestedDeliveryDate).format('DD/MM/YYYY (ddd)')}
              </Text>
            </View>
            <View className="flex-row  justify-between py-3 border-t border-gray-900">
              <Text className="font-medium">Products ordered</Text>
              <Text className="font-medium">{productsOrdered}</Text>
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
