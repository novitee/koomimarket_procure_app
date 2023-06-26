import {View} from 'react-native';
import React, {useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function AddSupplierName({
  navigation,
}: NativeStackScreenProps<any>) {
  const [name, setName] = useState('');

  function handleNext() {
    console.log(`name :>>`, name);
    navigation.navigate('AddSupplierPurpose');
  }
  return (
    <Container>
      <View className="flex-1">
        <Input onChangeText={setName} placeholder="Supplier Name" />
      </View>
      <Button onPress={handleNext} disabled={!name}>
        Next
      </Button>
    </Container>
  );
}
