import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {customScreenOptions, myOutletsScreenOptions} from './common';

import SupplerTabNavigator from './SupplerTabNavigator';
import MyOutletsScreen from 'screens/Outlets/MyOutlets';
import SettingsScreen from 'screens/Outlets/Settings';
import SupportScreen from 'screens/Outlets/Support';
import AddOutletScreen from 'screens/Outlets/AddOutlet';
import EditProfileScreen from 'screens/Outlets/EditProfile';
import EditOutletScreen from 'screens/Outlets/EditOutlet';
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
        <Stack.Screen name="AddOutlet" component={AddOutletScreen} />
        <Stack.Screen name="KoomiSupport" component={SupportScreen} />
        <Stack.Screen name="KoomiSupportChat" component={SupportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="EditOutlet" component={EditOutletScreen} />
      </Stack.Group>

      <Stack.Screen name="SupplerTabs" component={SupplerTabNavigator} />
    </Stack.Navigator>
  );
}
