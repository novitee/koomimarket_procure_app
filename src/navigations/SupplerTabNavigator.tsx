import React from 'react';
import {customTabScreenOptions, mainHeaderTitleStyle} from './common';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SupplierScreen from 'screens/SupplierTabs/Supplier';
import OrderScreen from 'screens/SupplierTabs/Order';
import TeamScreen from 'screens/SupplierTabs/Team';
const Tab = createBottomTabNavigator();

export default function SupplerTabNavigator() {
  return (
    <Tab.Navigator screenOptions={customTabScreenOptions}>
      <Tab.Screen
        name="Supplier"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
        }}
        component={SupplierScreen}
      />
      <Tab.Screen
        name="Order"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
        }}
        component={OrderScreen}
      />
      <Tab.Screen
        name="Team"
        options={{
          headerTitleStyle: mainHeaderTitleStyle,
        }}
        component={TeamScreen}
      />
    </Tab.Navigator>
  );
}
