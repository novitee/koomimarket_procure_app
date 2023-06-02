import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import useMe from 'hooks/useMe';
import MainNavigator from './MainNavigator';

function Navigator(): JSX.Element {
  const {isAuth} = useMe();
  if (false) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}

export default function Navigations() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
