import {View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Text from 'components/Text';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import OtpInput from 'components/OtpInput';
import {saveAuthData} from 'utils/auth';

const urls: Record<string, string> = {
  signUp: 'registrations/verify-otp-code',
  login: 'otp/verify',
};

export default function VerifyOTP({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {phoneNumber, otpToken, mode} = route.params || {};

  const [otpCode, setOtpCode] = useState('');

  const [{loading}, verifyOTP] = useMutation({
    url: urls[mode],
  });

  async function handleVerify() {
    const {success, data, error} = await verifyOTP({
      otpToken,
      otpCode,
    });
    if (success) {
      const {token, refreshToken} = data;
      saveAuthData({token, refreshToken});

      if (mode === 'signUp') {
        navigation.navigate('WhatYouDo', {
          mode,
        });
      } else {
        navigation.navigate('WhatYouDo', {
          mode,
        });
      }
    } else {
      console.log(`error :>>`, error);
    }
  }

  return (
    <Container>
      <View className="flex-1">
        <Text className="text-24 font-bold text-center">
          We just text a code to:
        </Text>
        <Text className="text-24 font-bold text-center">{phoneNumber}</Text>
        <Text className="text-24 font-bold text-center">
          Enter the code below
        </Text>

        <OtpInput
          containerClassName="mt-10"
          onChange={text => setOtpCode(text)}
        />
      </View>

      <Button loading={loading} onPress={handleVerify}>
        Next
      </Button>
    </Container>
  );
}
