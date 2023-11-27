import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import useMe from 'hooks/useMe';
import MainNavigator from './MainNavigator';
import {useAppStore} from 'stores/app';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {customScreenOptions} from './common';
const Stack = createNativeStackNavigator();

function Navigator(): JSX.Element {
  const {} = useMe();
  const {authStatus} = useAppStore();

  return (
    <Stack.Navigator screenOptions={customScreenOptions}>
      {authStatus !== 'BUYER_COMPLETED' && (
        <Stack.Screen
          name="AuthStack"
          options={{headerShown: false}}
          component={AuthNavigator}
        />
      )}

      {authStatus === 'BUYER_COMPLETED' && (
        <Stack.Screen
          name="MainStack"
          options={{headerShown: false}}
          component={MainNavigator}
        />
      )}
    </Stack.Navigator>
  );
}

const linking = {
  prefixes: ['koomimarket://'],
  config: {
    screens: {
      MainStack: {
        initialRouteName: 'MyOutlets',
        screens: {
          OrderDetail: 'orders/:orderNo',
        },
      },
    },
  },
};

export default function Navigations() {
  return (
    <NavigationContainer linking={linking}>
      <Navigator />
    </NavigationContainer>
  );
}

