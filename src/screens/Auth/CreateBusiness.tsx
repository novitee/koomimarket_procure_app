import {View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const url: string = 'registrations/update-sign-up-profile';

export default function CreateBusiness({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
  });
  const [{loading}, updateSignUpProfile] = useMutation({
    method: 'PATCH',
    url: url,
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

  const {businessName, deliveryAddress, postalCode, billingAddress, unitNo} =
    values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function validateInputs() {
    return true;
  }

  async function handleUpdateProfile() {
    if (!validateInputs()) return;

    const {success, data, error, message} = await updateSignUpProfile({
      entityRegistration: {
        registrationInfo: {
          company: {name: businessName, unitNo},
        },
      },
    });
    if (success) {
      navigation.navigate('WhatYouLike');
    } else {
      Toast.show(message, Toast.LONG);
    }
  }

  return (
    <Container>
      <View className="flex-1">
        <Title>Tell us about your business</Title>
        <SubTitle>
          This information will help suppliers recognise the orders you send.
        </SubTitle>

        <FormGroup>
          <Label required>Business Name</Label>
          <Input
            value={businessName}
            onChangeText={text => onChangeText(text, 'businessName')}
            placeholder="e.g. Ah Gao’s Cafe"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Business Address</Label>
          <Input
            value={postalCode}
            onChangeText={text => onChangeText(text, 'postalCode')}
            placeholder="Postal Code"
            className="mb-4"
          />
          <Input
            value={billingAddress}
            onChangeText={text => onChangeText(text, 'billingAddress')}
            placeholder="Billing Address"
            className="mb-4"
          />
          <Input
            value={unitNo}
            onChangeText={text => onChangeText(text, 'unitNo')}
            placeholder="Unit Number"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Delivery Address</Label>
          <Input
            value={postalCode}
            onChangeText={text => onChangeText(text, 'postalCode')}
            placeholder="Postal Code"
            className="mb-4"
          />
          <Input
            value={deliveryAddress}
            inputMode="email"
            onChangeText={text => onChangeText(text, 'deliveryAddress')}
            placeholder="Delivery Address"
            className="mb-4"
          />
          <Input
            value={unitNo}
            onChangeText={text => onChangeText(text, 'unitNo')}
            placeholder="Unit Number"
          />
        </FormGroup>
      </View>
      <View className="fixed bottom-0 left-0 right-0">
        <Button>Create Business</Button>
      </View>
    </Container>
  );
}
