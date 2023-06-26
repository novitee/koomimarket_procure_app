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
    navigation.pop(6);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Name of Supplier',
    });
  }, [navigation]);

  return (
    <Container>
      <View className="items-center justify-center flex-1">
        <Text className="text-48 text-primary font-bold text-center">
          We are on it!
        </Text>
        <Text className="text-center text-18 text-gray-700 mt-2">
          Your chat will be ready in 24 hours and you will be notified.
        </Text>
      </View>
      <Button onPress={handleBack}>Back to Home</Button>
    </Container>
  );
}
