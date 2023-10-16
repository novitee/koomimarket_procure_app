import {View, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Text from 'components/Text';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import OtpInput from 'components/OtpInput';
import {saveAuthData} from 'utils/auth';
import {useGlobalStore} from 'stores/global';
import {ROLE_BUYER} from 'configs/index';
import Toast from 'react-native-simple-toast';
import useMe from 'hooks/useMe';
import {IAppStore, setState} from 'stores/app';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';

const urls: Record<string, string> = {
  signUp: 'registrations/verify-otp-code',
  login: 'otp/verify',
};

export default function VerifyOTP({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {phoneNumber, otpToken} = route.params || {};
  const mode = useGlobalStore(s => s.authMode) || '';
  const authStateRef = useRef<IAppStore['authStatus'] | ''>();
  const {isUserLoading, user, refresh} = useMe();

  const [otpCode, setOtpCode] = useState('');

  const [{loading}, verifyOTP] = useMutation({
    url: urls[mode],
  });

  useEffect(() => {
    if (user && authStateRef.current) {
      setState({authStatus: authStateRef.current});
    }
  }, [navigation, user]);

  async function handleVerify() {
    const {success, data, error, message} = await verifyOTP({
      otpToken,
      otpCode,
    });
    if (success) {
      const {token, refreshToken, roleDepartments} = data;
      saveAuthData({token, refreshToken});
      if (mode === 'signUp') {
        authStateRef.current = 'REGISTERING';
        setState({authStatus: authStateRef.current});
      } else if (roleDepartments.length === 2) {
        authStateRef.current = 'AUTH_COMPLETED';
      } else if (roleDepartments.includes(ROLE_BUYER)) {
        authStateRef.current = 'BUYER_COMPLETED';
      }
      refresh();
    } else {
      Toast.show(error?.message || message, Toast.LONG);
    }
  }

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView>
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
        </ScrollView>
        {/* <View>
          <Button loading={loading || isUserLoading} onPress={handleVerify}>
            Next
          </Button>
        </View> */}
      </KeyboardAvoidingView>
    </Container>
  );
}
