import {View} from 'react-native';
import React from 'react';
import LogoIcon from 'assets/images/koomi-logo.svg';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {setGlobal} from 'stores/global';

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;

  function navigateTo(mode: string) {
    setGlobal({authMode: mode});
    navigate('VerifyNumber');
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <LogoIcon width={263} height={56} />
      </View>
      <View>
        <Button onPress={() => navigateTo('login')}>Login</Button>
        <Button
          onPress={() => navigateTo('signUp')}
          className="mt-4"
          variant="outline">
          Sign Up
        </Button>
      </View>
    </Container>
  );
}
