import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {customScreenOptions, myOutletsScreenOptions} from './common';

import SupplerTabNavigator from './SupplerTabNavigator';
import WelcomeScreen from 'screens/Auth/Welcome';
import MyOutletsScreen from 'screens/Outlets/MyOutlets';
const Stack = createNativeStackNavigator();

export default function MainNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={customScreenOptions}>
      <Stack.Group>
        <Stack.Screen
          options={myOutletsScreenOptions}
          name="MyOutlets"
          component={MyOutletsScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AddOutlet"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="KoomiSupport"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="KoomiSupportChat"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Settings"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditProfile"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditOutlet"
          component={WelcomeScreen}
        />
      </Stack.Group>

      <Stack.Screen
        options={{headerShown: false}}
        name="SupplerTabs"
        component={SupplerTabNavigator}
      />
    </Stack.Navigator>
  );
}
