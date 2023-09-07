import {View, ScrollView} from 'react-native';
import React, {useReducer, useState, useEffect, useCallback} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';
import Toast from 'react-native-simple-toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import useMutation from 'libs/swr/useMutation';

const url: string = 'registrations/update-sign-up-profile';

export default function JoinMyTeamScreen({
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

  const {loading: loadingPostal, handlePostalCodeChange} = usePostalCode();

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {...updatedValues, ...action};
  }

  const {
    businessName,
    postalCode,
    unitNo,
    billingAddress,
    errors = {},
  } = values;

  const onChangeFields = useCallback(
    (fields: {[key: string]: string | boolean | object}) => {
      dispatch({...fields, render: true});
    },
    [],
  );

  const handleChangePostalCode = useCallback(
    async (text: string) => {
      const address = await handlePostalCodeChange(text);
      if (address) {
        onChangeFields({billingAddress: address, postalCode: text});
      }
    },
    [handlePostalCodeChange],
  );

  const validateInputs = useCallback(
    (errors: {[key: string]: boolean}) => {
      onChangeFields({errors});
      return Object.keys(errors).reduce((acc: boolean, key: string) => {
        if (errors[key]) {
          Toast.show('Please fill in all required fields', Toast.SHORT);
          return false;
        }
        return acc;
      }, true);
    },
    [onChangeFields],
  );

  const handleJoinTeam = useCallback(async () => {
    const validFields = validateInputs({
      ...errors,
      businessName: !businessName,
      postalCode: !postalCode,
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
      navigation.navigate('SupplierThankYou');
    } else {
      Toast.show(message, Toast.LONG);
    }
  }, [businessName, postalCode, unitNo, billingAddress, errors]);

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <Title>Where do you work?</Title>
          <SubTitle>
            This information will help us connect you with your team.
          </SubTitle>

          <FormGroup>
            <Label required>Business Name</Label>
            <Input
              value={businessName}
              onChangeText={(text: string) =>
                onChangeFields({
                  businessName: text,
                  errors: {...errors, businessName: !text},
                })
              }
              placeholder="e.g. Ah Gao’s Cafe"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Delivery Address</Label>
            <Input
              value={postalCode}
              onChangeText={handleChangePostalCode}
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.postalCode,
              })}
              keyboardType="numeric"
              placeholder="e.g. 6454678"
            />
            <Input
              value={billingAddress}
              placeholder="Address"
              className="mb-4"
              editable={false}
            />
            <Input
              value={unitNo}
              onChangeText={(text: string) => onChangeFields({unitNo: text})}
              placeholder="Unit Number"
            />
          </FormGroup>
        </ScrollView>
        <View className=" pt-4 px-5">
          <Button
            onPress={handleJoinTeam}
            loading={loading || loadingPostal}
            className={clsx({
              'w-full': true,
            })}>
            Join Team
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
