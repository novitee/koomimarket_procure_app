import {View} from 'react-native';
import React from 'react';
import LogoIcon from 'assets/images/logo.svg';
import Container from 'components/Container';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;

  return (
    <Container>
      <View className="flex-1 justify-center items-center">
        <LogoIcon />
      </View>
      <View>
        <Button onPress={() => navigate('VerifyNumber', {mode: 'login'})}>
          Login
        </Button>
        <Button
          onPress={() => navigate('VerifyNumber', {mode: 'signUp'})}
          className="mt-4"
          variant="outline">
          Sign Up
        </Button>
      </View>
    </Container>
  );
}
