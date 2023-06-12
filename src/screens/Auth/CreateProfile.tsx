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
import {validateEmail} from 'utils/validate';
const url: string = 'registrations/update-sign-up-profile';

export default function CreateProfile({
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

  const {fullName, emailAddress} = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function validateInputs() {
    if (!fullName) {
      Toast.show('Please enter your full name', Toast.LONG);
      return false;
    }
    if (!emailAddress) {
      Toast.show('Please enter your email address', Toast.LONG);
      return false;
    }
    if (!validateEmail(emailAddress)) {
      Toast.show('Please enter a valid email address', Toast.LONG);
      return false;
    }
    return true;
  }

  async function handleUpdateProfile() {
    if (!validateInputs()) return;

    const {success, data, error, message} = await updateSignUpProfile({
      entityRegistration: {
        user: {
          email: emailAddress,
          fullName: fullName,
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
        <Title>Let’s create your profile</Title>
        <SubTitle>
          Your profile is how you’ll be recognised by others on Koomi.
        </SubTitle>

        <FormGroup>
          <Label required>Full name</Label>
          <Input
            value={fullName}
            onChangeText={text => onChangeText(text, 'fullName')}
          />
        </FormGroup>
        <FormGroup>
          <Label required>Email Address</Label>
          <Input
            value={emailAddress}
            inputMode="email"
            onChangeText={text => onChangeText(text, 'emailAddress')}
          />
        </FormGroup>
      </View>

      <Button loading={loading} onPress={handleUpdateProfile}>
        Next
      </Button>
    </Container>
  );
}
