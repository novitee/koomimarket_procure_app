import {ScrollView, View} from 'react-native';
import React, {useReducer, useState, useCallback} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';
import {saveAuthData} from 'utils/auth';
import {setState} from 'stores/app';

const url: string = 'registrations/update-sign-up-profile';

export default function CreateBusiness({
  navigation,
}: NativeStackScreenProps<any>) {
  function reducer(state: any, action: any) {
    return {...state, ...action};
  }
  const [values, dispatch] = useReducer(reducer, {
    businessName: '',
    postalCode: '',
    billingAddress: '',
    unitNo: '',
  });

  const [{loading}, updateSignUpProfile] = useMutation({
    method: 'PATCH',
    url: url,
  });
  const [{loading: loadingComplete}, completeSignUpProfile] = useMutation({
    url: 'registrations/complete',
  });

  const {loading: loadingPostal, handlePostalCodeChange} = usePostalCode();

  const {
    businessName,
    postalCode,
    billingAddress,
    unitNo,
    errors = {},
  } = values;

  async function handleChangePostalCode(text: string) {
    let newAddress = billingAddress;
    if (text.length >= 6) {
      newAddress = await handlePostalCodeChange(text);
    }
    let changeFields = {
      postalCode: text,
      billingAddress: newAddress,
      errors: {
        ...errors,
        postalCode: !text,
        billingAddress: !newAddress,
      },
    } as any;

    dispatch(changeFields);
  }

  function validateInputs(errors: {[key: string]: boolean}) {
    dispatch({errors});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
  }

  const handleOpenComplete = useCallback(async () => {
    const {data, success, message} = await completeSignUpProfile();
    if (!success) {
      Toast.show(message, Toast.LONG);
      return;
    }

    setState({authStatus: 'NOT_AUTH'});
    // saveAuthData({
    //   token: authData.token,
    //   refreshToken: authData.refreshToken,
    // });
    // setState({authStatus: 'BUYER_COMPLETED'});
  }, [completeSignUpProfile]);

  const handleUpdateProfile = async () => {
    const validFields = validateInputs({
      ...errors,
      businessName: !businessName,
      postalCode: !postalCode,
      billingAddress: !billingAddress,
    });
    if (!validFields) return;

    const {success, message} = await updateSignUpProfile({
      entityRegistration: {
        registrationInfo: {
          company: {
            name: businessName,
            postal: postalCode,
            unitNo,
            billingAddress,
          },
        },
      },
    });
    if (success) {
      handleOpenComplete();
    } else {
      Toast.show(message, Toast.LONG);
    }
  };

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
              onChangeText={(text: string) =>
                dispatch({
                  businessName: text,
                  errors: {...errors, businessName: !text},
                })
              }
              placeholder="e.g. John Doe Cafe"
              className={errors.businessName ? 'border-red-500' : ''}
            />
          </FormGroup>
          <FormGroup>
            <Label required>Business Address</Label>
            <Input
              value={postalCode}
              onChangeText={handleChangePostalCode}
              placeholder="Postal Code"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.postalCode,
              })}
              keyboardType="numeric"
              editable={!loadingPostal}
            />
            <Input
              value={billingAddress}
              placeholder="Billing Address"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.billingAddress,
              })}
              onChangeText={(text: string) =>
                dispatch({
                  billingAddress: text,
                  errors: {...errors, billingAddress: !text},
                })
              }
            />
            <Input
              value={unitNo}
              onChangeText={(text: string) => dispatch({unitNo: text})}
              placeholder="Unit Number"
            />
          </FormGroup>
        </ScrollView>
        <View className=" pt-4 px-5">
          <Button
            onPress={handleUpdateProfile}
            loading={loading || loadingPostal || loadingComplete}>
            Create Business
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
