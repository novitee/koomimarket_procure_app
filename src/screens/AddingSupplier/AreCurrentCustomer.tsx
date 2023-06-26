import {View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const options = [
  {
    id: false,
    label: 'No',
  },
  {
    id: true,
    label: 'Yes',
  },
];

export default function AreCurrentCustomerScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {supplier} = route?.params || {};
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    purchasedSupplier: null,
    accountNumber: '',
  });

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

  const {purchasedSupplier} = values;

  function handleNext() {
    console.log(`values :>>`, values);
    // navigation.navigate('AddSupplierContact');
  }

  const isDisabled = purchasedSupplier === null;
  return (
    <Container>
      <View className="flex-1">
        <Label>Are you currently a customer with {supplier?.name}?</Label>
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
        Add Supplier
      </Button>
    </Container>
  );
}
