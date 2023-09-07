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
import {validateEmail} from 'utils/validate';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
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

  const onChangeText = useCallback(
    (text: string, field: string) => {
      dispatch({[field]: text, render: true});
    },
    [dispatch],
  );

  const validateInputs = useCallback(() => {
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
  }, [fullName, emailAddress]);

  const handleUpdateProfile = useCallback(async () => {
    if (!validateInputs()) return;

    const {success, message} = await updateSignUpProfile({
      entityRegistration: {
        entityType: {code: 'CUSTOMER'},
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
  }, [fullName, emailAddress, updateSignUpProfile, navigation, validateInputs]);

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <Title>Let’s create your profile</Title>
          <SubTitle>
            Your profile is how you’ll be recognised by others on Koomi.
          </SubTitle>

          <FormGroup>
            <Label required>Full name</Label>
            <Input
              value={fullName}
              onChangeText={text => onChangeText(text, 'fullName')}
              placeholder="e.g. Tan Ah Gao"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Email Address</Label>
            <Input
              value={emailAddress}
              inputMode="email"
              onChangeText={text => onChangeText(text, 'emailAddress')}
              placeholder="e.g. ahgao@business.com"
            />
          </FormGroup>
        </ScrollView>

        <View className="px-5">
          <Button loading={loading} onPress={handleUpdateProfile}>
            Next
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
