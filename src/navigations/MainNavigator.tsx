import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import KoomiLogo from 'assets/images/koomi-logo.svg';
import {customScreenOptions, myOutletsScreenOptions} from './common';

import SupplerTabNavigator from './SupplerTabNavigator';
import MyOutletsScreen from 'screens/Outlets/MyOutlets';
import SettingsScreen from 'screens/Outlets/Settings';
import SupportScreen from 'screens/Outlets/Support';
import AddOutletScreen from 'screens/Outlets/AddOutlet';
import EditProfileScreen from 'screens/Outlets/EditProfile';
import EditOutletScreen from 'screens/Outlets/EditOutlet';
import AddSupplierName from 'screens/AddingSupplier/AddSupplierName';
import AddSupplierPurpose from 'screens/AddingSupplier/AddSupplierPurpose';
import AddSupplierContact from 'screens/AddingSupplier/AddSupplierContact';
import UploadOrderList from 'screens/AddingSupplier/UploadOrderList';
import CompleteAdding from 'screens/AddingSupplier/CompleteAdding';
import SendInfo from 'screens/AddingSupplier/SendInfo';
const Stack = createNativeStackNavigator();

const HeaderLogo = () => <KoomiLogo width={156} height={32} />;

export default function MainNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={customScreenOptions}>
      {/* Outlets */}
      <Stack.Group>
        <Stack.Screen
          options={myOutletsScreenOptions}
          name="MyOutlets"
          component={MyOutletsScreen}
        />
        <Stack.Screen name="AddOutlet" component={AddOutletScreen} />
        <Stack.Screen
          name="KoomiSupport"
          options={{
            headerTitle: HeaderLogo,
          }}
          component={SupportScreen}
        />
        <Stack.Screen name="KoomiSupportChat" component={SupportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="EditProfile"
          options={{
            headerTitle: 'Edit Profile',
          }}
          component={EditProfileScreen}
        />
        <Stack.Screen name="EditOutlet" component={EditOutletScreen} />
      </Stack.Group>
      {/* SupplerTabs */}

      <Stack.Screen
        name="SupplierTabs"
        options={{
          headerShown: false,
        }}
        component={SupplerTabNavigator}
      />

      {/* AddingSupplier */}
      <Stack.Group>
        <Stack.Screen
          name="AddSupplierName"
          options={{
            headerTitle: 'Add Supplier',
          }}
          component={AddSupplierName}
        />
        <Stack.Screen
          name="AddSupplierPurpose"
          component={AddSupplierPurpose}
          options={{
            headerTitle: 'Add Supplier',
          }}
        />
        <Stack.Screen
          name="AddSupplierContact"
          component={AddSupplierContact}
          options={{
            headerTitle: 'Add Supplier',
          }}
        />
        <Stack.Screen
          name="UploadOrderList"
          options={{
            headerTitle: 'Upload Order List',
          }}
          component={UploadOrderList}
        />
        <Stack.Screen name="SendInfo" component={SendInfo} />
        <Stack.Screen
          name="CompleteAdding"
          options={{
            headerBackVisible: false,
            headerLeft: () => null,
          }}
          component={CompleteAdding}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
