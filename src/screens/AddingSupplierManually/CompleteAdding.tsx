import React, {useLayoutEffect} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {View} from 'react-native';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function CompleteAdding({
  navigation,
}: NativeStackScreenProps<any>) {
  function handleBack() {
    navigation.navigate('SupplierTabs');
  }

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: 'Name of Supplier',
  //   });
  // }, [navigation]);

  return (
    <Container>
      <View className="items-center justify-center flex-1">
        <Text className="text-48 text-primary font-bold text-center">
          Voila!
        </Text>
        <Text className="text-center text-18 text-gray-700 mt-10">
          Successfully added your supplier to the Supplier Listing.
        </Text>
        <Text className="text-center text-18 text-gray-700 mt-10">
          You may now proceed to place an order with this supplier.
        </Text>
      </View>
      <Button onPress={handleBack}>Back to Supplier Listing Page</Button>
    </Container>
  );
}
