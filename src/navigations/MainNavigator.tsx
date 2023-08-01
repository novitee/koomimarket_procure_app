import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import KoomiLogo from 'assets/images/koomi-logo.svg';
import {customScreenOptions, myOutletsScreenOptions} from './common';

import SupplerTabNavigator from './SupplerTabNavigator';
import MyOutletsScreen from 'screens/Outlets/MyOutlets';
import SettingsScreen from 'screens/Outlets/Settings';
import SupportScreen from 'screens/Outlets/Support';
import AddOutletScreen from 'screens/Outlets/AddOutlet';
import EditProfileScreen from 'screens/Outlets/EditProfile';
import EditOutletScreen from 'screens/Outlets/EditOutlet';
import AddSupplierName from 'screens/AddingSupplierManually/AddSupplierName';
import AddSupplierPurpose from 'screens/AddingSupplierManually/AddSupplierPurpose';
import AddSupplierContact from 'screens/AddingSupplierManually/AddSupplierContact';
import UploadOrderList from 'screens/AddingSupplierManually/UploadOrderList';
import CompleteAdding from 'screens/AddingSupplierManually/CompleteAdding';
import SendInfo from 'screens/AddingSupplierManually/SendInfo';
import AddTeamMemberScreen from 'screens/SupplierTabs/AddTeamMember';
import {TouchableOpacity} from 'react-native';
import Text from 'components/Text';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import SupplierListScreen from 'screens/AddingSupplier/SupplierList';
import SupplierGroupScreen from 'screens/AddingSupplier/SupplierGroup';
import SupplierProfileScreen from 'screens/AddingSupplier/SupplierProfile';
import AreCurrentCustomerScreen from 'screens/AddingSupplier/AreCurrentCustomer';
import ProductCatalogueScreen from 'screens/SupplierOrder/ProductCatalogue';
import NewOrderScreen from 'screens/SupplierOrder/NewOrder';
import AddingProductTypeScreen from 'screens/AddingProductMannually/AddingProductType';
import UploadInvoiceScreen from 'screens/AddingProductMannually/UploadInvoice';
import AddingProductFormScreen from 'screens/AddingProductMannually/AddingProductForm';
import ProductDetailScreen from 'screens/SupplierOrder/ProductDetail';
import ManageOrderListScreen from 'screens/ManageOrderList';

const Stack = createNativeStackNavigator();

const HeaderLogo = () => <KoomiLogo width={156} height={32} />;

export const customScreenMemberOptions:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = ({navigation}) => ({
  headerBackVisible: false,
  headerLeft: () => (
    <TouchableOpacity onPress={navigation.goBack}>
      <Text className="text-primary">Cancel</Text>
    </TouchableOpacity>
  ),
  headerTitle: 'Add Team Member',
});

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
      <Stack.Screen
        name="AddTeamMember"
        options={customScreenMemberOptions}
        component={AddTeamMemberScreen}
      />

      {/* AddingSupplier */}
      <Stack.Group>
        <Stack.Screen
          name="SupplierList"
          options={{
            headerTitle: 'Add Suppliers',
          }}
          component={SupplierListScreen}
        />
        <Stack.Screen
          name="SupplierGroup"
          options={{
            headerTitle: '',
          }}
          component={SupplierGroupScreen}
        />
        <Stack.Screen
          name="SupplierProfile"
          options={{
            headerShown: false,
          }}
          component={SupplierProfileScreen}
        />
        <Stack.Screen
          name="AreCurrentCustomer"
          options={{
            headerTitle: 'Add Suppliers',
          }}
          component={AreCurrentCustomerScreen}
        />
      </Stack.Group>
      {/* AddingSupplierManually */}
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

      {/* Adding Product */}

      <Stack.Group>
        <Stack.Screen
          name="NewOrder"
          options={{
            headerTitle: 'New Order',
          }}
          component={NewOrderScreen}
        />

        <Stack.Screen
          name="ProductCatalogue"
          component={ProductCatalogueScreen}
          options={{
            headerTitle: 'Browse Catalogue',
          }}
        />

        <Stack.Screen
          name="AddingProductType"
          component={AddingProductTypeScreen}
          options={{
            headerTitle: 'Add Products Manually',
          }}
        />

        <Stack.Screen
          name="UploadInvoice"
          component={UploadInvoiceScreen}
          options={{
            headerTitle: 'Upload a Past Invoice',
          }}
        />

        <Stack.Screen
          name="AddProductsManuallyForm"
          component={AddingProductFormScreen}
          options={{
            headerTitle: 'Add Products Manually',
          }}
        />

        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen
          name="ManageOrderList"
          component={ManageOrderListScreen}
          options={{
            headerTitle: 'Manage Order List',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
