import {View} from 'react-native';
import React, {useReducer} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Text from 'components/Text';
import ProgressBar from 'components/ProgressBar';

const options = [
  {
    id: true,
    label: 'Yes',
  },
  {
    id: false,
    label: 'No',
  },
];

export default function AddSupplierPurpose({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    isCustomerPurchased: null,
    accountNumber: '',
  });
  const {supplierName} = route?.params || {};
  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const {isCustomerPurchased, accountNumber} = values;

  function handleNext() {
    const params = {
      isCustomerPurchased: isCustomerPurchased,
      linkedAccountNumber: accountNumber,
      supplierName,
    };
    navigation.navigate('AddSupplierContact', params);
  }

  const isDisabled = isCustomerPurchased === null;
  return (
    <>
      <ProgressBar total={5} step={2} tag="AddSupplierManually" />
      <Container>
        <View className="flex-1">
          <Label>
            Are you currently a customer with{' '}
            <Text className="text-primary">{supplierName}</Text>?
          </Label>
          <View className="flex-row gap-x-4 mt-3 ">
            {options.map(option => (
              <Button
                key={option.label}
                className="flex-1"
                variant={
                  option.id === isCustomerPurchased ? 'primary' : 'secondary'
                }
                onPress={() => dispatch({isCustomerPurchased: option.id})}>
                {option.label}
              </Button>
            ))}
          </View>
          {!!isCustomerPurchased && (
            <FormGroup className="mt-10">
              <Label>Your Customer Account Number (Optional)</Label>
              <Input onChangeText={text => dispatch({accountNumber: text})} />
            </FormGroup>
          )}
        </View>
        <Button onPress={handleNext} disabled={isDisabled}>
          Next
        </Button>
      </Container>
    </>
  );
}
