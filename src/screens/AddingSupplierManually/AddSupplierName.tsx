import {View} from 'react-native';
import React, {useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Label from 'components/Form/Label';
import ProgressBar from 'components/ProgressBar';

export default function AddSupplierName({
  navigation,
}: NativeStackScreenProps<any>) {
  const [name, setName] = useState('');

  function handleNext() {
    navigation.navigate('AddSupplierPurpose', {supplierName: name});
  }
  return (
    <>
      <ProgressBar total={5} step={1} tag="AddSupplierManually" />
      <Container>
        <View className="flex-1">
          <Label required>Enter your supplier name</Label>
          <Input onChangeText={setName} placeholder="Supplier Name" />
        </View>
        <Button onPress={handleNext} disabled={!name}>
          Next
        </Button>
      </Container>
    </>
  );
}
