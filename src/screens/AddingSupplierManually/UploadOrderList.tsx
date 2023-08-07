import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import clsx from 'libs/clsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const options = [
  {
    title: 'Send a photo',
    description: 'Send us pictures of your invoices or delivery receipts.',
    type: 'photo',
  },
  {
    title: 'Send an email',
    description:
      'Attach any digital invoices / delivery receipts (excel, pdf, csv, etc).',
    type: 'email',
  },
];

export default function UploadOrderList({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [type, setType] = useState();
  const {supplier} = route?.params || {};
  function toSendInfo() {
    navigation.navigate('SendInfo', {
      type,
      supplierId: supplier?.id,
    });
  }
  return (
    <Container>
      <View className="flex-1 justify-center">
        {options.map((option: any) => (
          <TouchableOpacity
            className={clsx({
              'rounded-xl items-center justify-center mb-8 p-4': true,
              'border-gray-400 border': option.type !== type,
              'border-primary border-[3px]': option.type === type,
            })}
            onPress={() => setType(option.type)}
            key={option.title}>
            <Text className="font-bold text-18">{option.title}</Text>
            <Text className="text-center mt-2">{option.description}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CompleteAdding')}>
          <Text className="text-center text-primary text-lg">
            I will do it later
          </Text>
        </TouchableOpacity>
      </View>
      <Button disabled={!type} onPress={toSendInfo}>
        Next
      </Button>
    </Container>
  );
}
