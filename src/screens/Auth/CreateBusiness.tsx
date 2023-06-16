import {ScrollView, View} from 'react-native';
import React, {useReducer, useState, useEffect} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CheckBox from 'components/CheckBox';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';

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
  const {values: pValues, handlePostalCodeChange} = usePostalCode();

  useEffect(() => {
    const {address, postalCode} = pValues;
    if (sameAsBillingAddress) {
      onChangeFields({
        postalCode: postalCode,
        billingAddress: address,
        deliveryPostalCode: postalCode,
        deliveryAddress: address,
        errors: {...errors, postalCode: !address},
      });
    } else {
      onChangeFields({
        postalCode: postalCode,
        billingAddress: address,
      });
    }
  }, [pValues]);

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {...updatedValues, ...action};
  }

  const {
    businessName,
    deliveryAddress,
    postalCode,
    billingAddress,
    unitNo,
    sameAsBillingAddress,
    deliveryPostalCode,
    deliveryUnitNo,
    errors = {},
  } = values;

  function onChangeText(text: string | boolean, field: string) {
    dispatch({[field]: text, render: true});
  }

  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function handleChangePostalCode(text: string) {
    handlePostalCodeChange(text);
  }

  // function handleSetSameAsBillingAddress(value: boolean) {
  //   if (value) {
  //     onChangeFields({
  //       deliveryAddress: billingAddress,
  //       deliveryUnitNo: unitNo,
  //       deliveryPostalCode: postalCode,
  //       sameAsBillingAddress: true,
  //     });
  //   } else {
  //     onChangeFields({
  //       sameAsBillingAddress: false,
  //     });
  //   }
  // }

  function handleChangeUnitNo(text: string) {
    if (sameAsBillingAddress) {
      onChangeFields({unitNo: text, deliveryUnitNo: text});
    } else {
      onChangeFields({unitNo: text});
    }
  }

  function validateInputs(errors: {[key: string]: boolean}) {
    onChangeFields({errors});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
  }

  async function handleUpdateProfile() {
    if (
      !validateInputs({
        ...errors,
        businessName: !businessName,
        postalCode: !postalCode,
      })
    )
      return;

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
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <Title>Tell us about your business</Title>
          <SubTitle>
            This information will help suppliers recognise the orders you send.
          </SubTitle>

          <FormGroup>
            <Label required>Business Name</Label>
            <Input
              value={businessName}
              // onChangeText={text => onChangeText(text, 'businessName')}
              onChangeText={(text: string) =>
                onChangeFields({
                  businessName: text,
                  errors: {...errors, businessName: !text},
                })
              }
              placeholder="e.g. Ah Gao’s Cafe"
              className={errors.businessName ? 'border-red-500' : ''}
            />
          </FormGroup>
          <FormGroup>
            <Label required>Business Address</Label>
            <Input
              value={postalCode}
              onChangeText={handleChangePostalCode}
              placeholder="Postal Code"
              // className="mb-4"
              className={errors.postalCode ? 'border-red-500 mb-4' : 'mb-4'}
              keyboardType="numeric"
            />
            <Input
              value={billingAddress}
              placeholder="Billing Address"
              className="mb-4"
              editable={false}
            />
            <Input
              value={unitNo}
              onChangeText={handleChangeUnitNo}
              placeholder="Unit Number"
            />
          </FormGroup>
          {/* <FormGroup>
            <Label required>Delivery Address</Label>
            <CheckBox
              label="Same as billing address"
              containerClassName="my-4"
              defaultValue={sameAsBillingAddress}
              onChange={handleSetSameAsBillingAddress}
            />
            <Input
              value={deliveryPostalCode}
              onChangeText={text => onChangeText(text, 'deliveryPostalCode')}
              placeholder="Postal Code"
              className="mb-4"
              keyboardType="numeric"
              editable={!sameAsBillingAddress}
            />
            <Input
              value={deliveryAddress}
              placeholder="Delivery Address"
              className="mb-4"
              editable={!sameAsBillingAddress}
            />
            <Input
              value={deliveryUnitNo}
              onChangeText={text => onChangeText(text, 'deliveryUnitNo')}
              placeholder="Unit Number"
              editable={!sameAsBillingAddress}
            />
          </FormGroup> */}
        </ScrollView>
        <View className=" pt-4 px-5">
          <Button
            onPress={handleUpdateProfile}
            loading={loading}
            className={clsx({
              'bg-gray-400 cursor-not-allowed': loading,
            })}>
            Create Business
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
