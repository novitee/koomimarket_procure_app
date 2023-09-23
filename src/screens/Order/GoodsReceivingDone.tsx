import {Text} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function GoodsReceivingDone({
  navigation,
}: NativeStackScreenProps<any>) {
  return (
    <Container className="items-center justify-center">
      <Text className="text-36 font-semibold text-primary">We are on it!</Text>
      <Text className="text-gray-700 font-medium mt-4">
        We’ll notify your feedback to the supplier.
      </Text>
      <Button
        className="mt-6"
        onPress={() =>
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
          })
        }>
        Got it
      </Button>
    </Container>
  );
}
