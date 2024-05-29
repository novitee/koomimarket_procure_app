import React from 'react';
import {customTabScreenOptions, mainHeaderTitleStyle} from './common';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import OrderScreen from 'screens/SupplierTabs/Order';
import TeamScreen from 'screens/SupplierTabs/Team';
import ChatScreen from 'screens/Chat';
const Tab = createBottomTabNavigator();

export default function SupplerTabNavigator() {
  return (
    <Tab.Navigator screenOptions={customTabScreenOptions}>
      <Tab.Screen
        name="Home"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
          headerTitle: '',
        }}
        component={ChatScreen}
      />
      <Tab.Screen
        name="Order"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
          headerTitle: '',
        }}
        component={OrderScreen}
      />
      <Tab.Screen
        name="Team"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
          headerTitle: '',
        }}
        component={TeamScreen}
      />
    </Tab.Navigator>
  );
}
