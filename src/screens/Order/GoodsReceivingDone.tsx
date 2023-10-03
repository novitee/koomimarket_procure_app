import {Text, View} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function GoodsReceivingDone({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {isAllGood} = route.params || {};

  const handlePress = () =>
    navigation.reset({
      index: 1,
      routes: [
        {
          name: 'SupplierTabs',
          params: {
            screen: 'Order',
          },
        },
      ],
    });

  return (
    <Container className="items-center justify-center">
      {isAllGood ? (
        <>
          <Text className="text-30 font-semibold text-primary">
            Thank you for the order!
          </Text>
          <View className="w-[281px]">
            <Text className="text-gray-700 font-medium mt-4 text-center text-16 leading-6">
              Your order is delivered and completed.
            </Text>
            <Text className="text-gray-700 font-medium text-center text-16 leading-6">
              Hope you enjoyed shopping with us!
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text className="text-36 font-semibold text-primary">
            We are on it!
          </Text>
          <Text className="text-gray-700 font-medium mt-4 text-16 ">
            We’ll notify your feedback to the supplier.
          </Text>
        </>
      )}

      <Button className="mt-6" onPress={handlePress}>
        {isAllGood ? 'Done' : 'Got it'}
      </Button>
    </Container>
  );
}
