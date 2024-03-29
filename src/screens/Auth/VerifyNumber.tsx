import {View, ScrollView} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import Button from 'components/Button';
import PhonePicker from 'components/ui/PhonePicker';
import useMutation from 'libs/swr/useMutation';
import Text, {Title} from 'components/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGlobalStore} from 'stores/global';
import Toast from 'react-native-simple-toast';

const urls: Record<string, string> = {
  signUp: 'registrations/verify-account',
  login: 'login',
};

export default function Login({navigation}: NativeStackScreenProps<any>) {
  const mode = useGlobalStore(s => s.authMode) || '';

  const [{loading}, verifyPhoneNumber] = useMutation({
    url: urls[mode],
  });

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    code: '',
    number: '',
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if ('code' in action) {
      updatedValues.code = action.code;
    }
    if ('number' in action) {
      updatedValues.number = action.number;
    }

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return updatedValues;
  }

  const {code, number} = values;

  function onChange(codeValue: string, numberValue: string) {
    dispatch({
      code: codeValue,
      number: numberValue,
      render: true,
    });
  }
  async function onNext() {
    const {success, data, error, message} = await verifyPhoneNumber({
      mobileCode: values.code.toString(),
      mobileNumber: values.number,
    });
    if (success) {
      navigation.navigate('VerifyOTP', {
        otpToken: data.otpToken,
        phoneNumber: `${values.code} ${values.number}`,
        mode,
      });
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView>
          <View className="mb-6">
            <Title className="text-center">What’s your phone number?</Title>
            <Text className="mt-6 font-light text-center text-24">
              We need this to set up your account or help you log back in.
            </Text>
          </View>
          <PhonePicker code={code} number={number} onChange={onChange} />
        </ScrollView>
        <View>
          <Button
            loading={loading}
            disabled={!code && !number}
            onPress={onNext}>
            Next
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
