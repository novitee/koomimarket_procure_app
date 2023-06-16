import {View} from 'react-native';
import React, {useReducer, useState, useEffect} from 'react';
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
import useMutation from 'libs/swr/useMutation';

const url: string = 'registrations/update-sign-up-profile';

export default function JoinMyTeamScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
  });
  const [{loading}, joinToTeam] = useMutation({
    method: 'PATCH',
    url: url,
  });
  const {values: pValues, handlePostalCodeChange} = usePostalCode();

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

  const {
    businessName,
    postalCode,
    unitNo,
    deliveryAddress,
    errors = {},
  } = values;

  useEffect(() => {
    const {address, postalCode} = pValues;
    onChangeFields({
      postalCode: postalCode,
      deliveryAddress: address,
    });
  }, [pValues]);

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function handleChangePostalCode(text: string) {
    handlePostalCodeChange(text);
  }

  function handleChangeUnitNo(text: string) {
    onChangeFields({unitNo: text});
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

  async function handleJoinTeam() {
    // if (
    //   !validateInputs({
    //     ...errors,
    //     businessName: !businessName,
    //     postalCode: !postalCode,
    //   })
    // )
    //   return;

    // const {success, data, error, message} = await updateSignUpProfile({
    //   entityRegistration: {
    //     registrationInfo: {
    //       company: {name: businessName, unitNo},
    //     },
    //   },
    // });
    // if (success) {
    navigation.navigate('SupplierThankYou');
    // } else {
    //   Toast.show(message, Toast.LONG);
    // }
  }

  return (
    <Container>
      <View className="flex-1">
        <Title>Where do you work?</Title>
        <SubTitle>
          This information will help us connect you with your team.
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
            value={deliveryAddress}
            placeholder="Address"
            className="mb-4"
            editable={false}
          />
          <Input
            value={unitNo}
            onChangeText={handleChangeUnitNo}
            placeholder="Unit Number"
          />
        </FormGroup>
      </View>

      <Button
        onPress={handleJoinTeam}
        loading={loading}
        className={clsx({
          'w-full': true,
          'bg-gray-400 cursor-not-allowed': loading,
        })}>
        Join Team
      </Button>
    </Container>
  );
}
