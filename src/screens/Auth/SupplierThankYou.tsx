import {View} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Text from 'components/Text';

export default function SupplierThankYouScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;

  return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <Text className="text-48 text-primary-600 bold-bold">Thank you</Text>
      </View>
      <View>
        <Button onPress={() => navigate('WhatYouDo')}>Back to home page</Button>
      </View>
    </Container>
  );
}
