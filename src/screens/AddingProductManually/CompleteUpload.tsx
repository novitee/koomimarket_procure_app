import {Text} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function CompleteUpload({
  navigation,
}: NativeStackScreenProps<any>) {
  return (
    <Container className="items-center justify-center">
      <Text className="text-36 font-semibold text-primary">We are on it!</Text>
      <Text className="text-gray-700 font-medium mt-4 w-[280px] text-center">
        We’ll add your products for you in less than 24 hours.
      </Text>
      <Button className="mt-6" onPress={() => navigation.navigate('NewOrder')}>
        Got it
      </Button>
    </Container>
  );
}
