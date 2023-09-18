import {View} from 'react-native';
import React, {useReducer, useState} from 'react';
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
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    purchasedSupplier: null,
    accountNumber: '',
  });
  const {supplierName} = route?.params || {};
  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {purchasedSupplier, accountNumber} = values;

  function handleNext() {
    const params = {
      isCustomerPurchased: !purchasedSupplier,
      linkedAccountNumber: accountNumber,
      supplierName,
    };
    navigation.navigate('AddSupplierContact', params);
  }

  const isDisabled = purchasedSupplier === null;
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
                  option.id === purchasedSupplier ? 'primary' : 'secondary'
                }
                onPress={() => dispatch({purchasedSupplier: option.id})}>
                {option.label}
              </Button>
            ))}
          </View>
          {!!purchasedSupplier && (
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
