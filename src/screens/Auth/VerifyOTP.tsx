import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Text from 'components/Text';
import colors from 'configs/colors';
import useMutation from 'libs/swr/useMutation';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {saveAuthData} from 'utils/auth';
import {useGlobalStore} from 'stores/global';
import {ROLE_BUYER} from 'configs/index';
import Toast from 'react-native-simple-toast';
import useMe from 'hooks/useMe';
import {IAppStore, setState} from 'stores/app';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';

const CELL_COUNT = 6;

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

  const [{loading}, verifyOTP] = useMutation({
    url: urls[mode],
  });

  useEffect(() => {
    if (user && authStateRef.current) {
      setState({authStatus: authStateRef.current});
    }
  }, [navigation, user]);

  async function handleVerify(otpCode: string) {
    const {success, data, error, message} = await verifyOTP({
      otpToken,
      otpCode,
    });
    if (success) {
      const {token, refreshToken, roleDepartments} = data;
      saveAuthData({token, refreshToken});
      console.log('mode', mode)
      console.log('roleDepartments', roleDepartments)
      if (mode === 'signUp') {
        authStateRef.current = 'REGISTERING';
        setState({authStatus: authStateRef.current, authRegisterType: 'BUYER'});
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

  function handleChangeText(text: string) {
    setValue(text);
    if (text.length === 6) {
      handleVerify(text);
    }
  }

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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

            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              autoFocus
              caretHidden={false}
              value={value}
              onChangeText={handleChangeText}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
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

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 20, width: 320, alignSelf: 'center'},
  cell: {
    width: 45,
    height: 45,
    lineHeight: 45,
    fontSize: 24,
    color: '#000',
    borderWidth: 1,
    borderColor: colors.chevron,
    textAlign: 'center',
    borderRadius: 5,
  },
  focusCell: {
    borderWidth: 2,
  },
});
