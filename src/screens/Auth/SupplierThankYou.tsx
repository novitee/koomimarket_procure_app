import {View} from 'react-native';
import React, {useEffect} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Text from 'components/Text';
import {setState} from 'stores/app';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {saveAuthData} from 'utils/auth';
import clsx from 'libs/clsx';
import {setGlobal} from 'stores/global';
import useMe from 'hooks/useMe';
import {useAppStore} from 'stores/app';

const completeSignUpUrl: string = 'registrations/complete';

export default function SupplierThankYouScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {isUserLoading, user, refresh} = useMe();
  const {authRegisterType} = useAppStore();
  const [{loading: loadingComplete}, completeSignUp] = useMutation({
    method: 'POST',
    url: completeSignUpUrl,
  });

  useEffect(() => {
    if (user) {
      setState({authStatus: 'AUTH_COMPLETED'});
    }
  }, [navigation, user]);

  async function handleComplete() {
    console.log('completeSignUp :>> ');
    const {data, success, error, message} = await completeSignUp();

    if (success) {
      const {authData} = data;
      console.log('data :>> ', data);
      setGlobal({authMode: 'login'});
      saveAuthData({
        token: authData.token,
        refreshToken: authData.refreshToken,
      });
      refresh();
    } else {
      Toast.show(error?.message || message, Toast.LONG);
    }
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <Text className="text-48 text-primary-600 font-bold">Thank you</Text>
        <Text className="mt-4 text-center max-w-[300px] leading-8 text-lg">
          {authRegisterType === 'SUPPLIER' &&
            'We’ll follow up as soon as we can within 24 hours.'}
          {authRegisterType === 'BUYER' &&
            'You will be connected with your team in the next 24 hours.'}
        </Text>
      </View>
      <View>
        <Button
          loading={loadingComplete || isUserLoading}
          className={clsx({
            'bg-gray-400 cursor-not-allowed': loadingComplete,
          })}
          onPress={handleComplete}>
          Back to home page
        </Button>
      </View>
    </Container>
  );
}
