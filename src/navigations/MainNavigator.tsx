import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import KoomiLogo from 'assets/images/koomi-logo.svg';
import {
  customScreenOptions,
  myOutletsScreenOptions,
  BackButton,
} from './common';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

import SupplerTabNavigator from './SupplerTabNavigator';
import MyOutletsScreen from 'screens/Outlets/MyOutlets';
import EditOutletScreen from 'screens/Outlets/EditOutlet';
import SettingsScreen from 'screens/Outlets/Settings';
import SupportScreen from 'screens/Outlets/Support';
import AddOutletScreen from 'screens/Outlets/AddOutlet';
import EditProfileScreen from 'screens/Outlets/EditProfile';
import EditBusinessScreen from 'screens/Outlets/EditBusiness';
import AddSupplierName from 'screens/AddingSupplierManually/AddSupplierName';
import AddSupplierPurpose from 'screens/AddingSupplierManually/AddSupplierPurpose';
import AddSupplierContact from 'screens/AddingSupplierManually/AddSupplierContact';
import UploadOrderList from 'screens/AddingSupplierManually/UploadOrderList';
import CompleteAdding from 'screens/AddingSupplierManually/CompleteAdding';
import SendInfo from 'screens/AddingSupplierManually/SendInfo';
import AddTeamMemberScreen from 'screens/SupplierTabs/AddTeamMember';
import InviteNewMemberScreen from 'screens/SupplierTabs/InviteNew';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import SupplierListScreen from 'screens/AddingSupplier/SupplierList';
import SupplierGroupScreen from 'screens/AddingSupplier/SupplierGroup';
import SupplierProfileScreen from 'screens/AddingSupplier/SupplierProfile';
import AreCurrentCustomerScreen from 'screens/AddingSupplier/AreCurrentCustomer';
import ProductCatalogueScreen from 'screens/SupplierOrder/ProductCatalogue';
import NewOrderScreen from 'screens/SupplierOrder/NewOrder';
import AddingProductTypeScreen from 'screens/AddingProductManually/AddingProductType';
import UploadInvoiceScreen from 'screens/AddingProductManually/UploadInvoice';
import CompleteUploadInvoiceScreen from 'screens/AddingProductManually/CompleteUpload';
import AddingProductFormScreen from 'screens/AddingProductManually/AddingProductForm';
import ProductDetailScreen from 'screens/SupplierOrder/ProductDetail';
import ManageOrderListScreen from 'screens/ManageOrderList';
import SelectScreen from 'screens/SelectScreen';
import FinalizeOrderScreen from 'screens/SupplierOrder/FinalizeOrder';
import DoneOrderScreen from 'screens/SupplierOrder/DoneOrder';
import OrderDetailScreen from 'screens/Order/OrderDetail';
import GoodsReceivingScreen from 'screens/Order/GoodsReceiving';
import GoodsReceivingIssue from 'screens/Order/GoodsReceivingIssue';
import GoodsReceivingDone from 'screens/Order/GoodsReceivingDone';
import AddSupplierProfileScreen from 'screens/AddingSupplier/AddSupplierProfile';
import CalendarListScreen from 'screens/CalendarListScreen';
import SupplierDetailScreen from 'screens/EditSupplier/SupplierDetail';
import EditSupplierDetailScreen from 'screens/EditSupplier/EditSupplierDetail';
import ChatScreen from 'screens/Chat';
import DeliveryCalendarScreen from 'screens/DeliveryCalendarScreen';
const Stack = createNativeStackNavigator();

const HeaderLogo = () => <KoomiLogo width={156} height={32} />;

export const customScreenSupplierTabOptions:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = ({navigation}) => {
  return {
    ...customScreenOptions,
    headerBackVisible: true,
    headerLeft: (props: HeaderBackButtonProps) => (
      <BackButton {...props} goBack={() => navigation.navigate('MyOutlets')} />
    ),
    headerShown: false,
  };
};

export default function MainNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={customScreenOptions}
      initialRouteName="MyOutlets">
      {/* Outlets */}
      <Stack.Group>
        <Stack.Screen
          options={myOutletsScreenOptions}
          name="MyOutlets"
          component={MyOutletsScreen}
        />
        <Stack.Screen
          name="AddOutlet"
          options={{
            headerTitle: 'Add Outlet',
          }}
          component={AddOutletScreen}
        />
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
            headerTitle: 'My Profile',
          }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="EditBusiness"
          component={EditBusinessScreen}
          options={{
            headerTitle: 'My Business',
          }}
        />
        <Stack.Screen
          name="EditOutlet"
          component={EditOutletScreen}
          options={{
            headerTitle: 'Edit Outlet',
          }}
        />
      </Stack.Group>
      {/* SupplerTabs */}

      <Stack.Screen
        name="SupplierTabs"
        options={customScreenSupplierTabOptions}
        component={SupplerTabNavigator}
      />
      <Stack.Screen
        name="AddTeamMember"
        options={{
          headerTitle: 'Add Team Member',
        }}
        component={AddTeamMemberScreen}
      />
      <Stack.Screen
        name="InviteNewMember"
        options={{
          headerTitle: 'Invite New Member',
        }}
        component={InviteNewMemberScreen}
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
        <Stack.Screen
          name="AddSupplierProfile"
          component={AddSupplierProfileScreen}
        />
      </Stack.Group>
      {/* AddingSupplierManually */}
      <Stack.Group>
        <Stack.Screen
          name="AddSupplierName"
          options={{
            headerTitle: 'Add Supplier Manually',
          }}
          component={AddSupplierName}
        />
        <Stack.Screen
          name="AddSupplierPurpose"
          component={AddSupplierPurpose}
          options={{
            headerTitle: 'Add Supplier Manually',
          }}
        />
        <Stack.Screen
          name="AddSupplierContact"
          component={AddSupplierContact}
          options={{
            headerTitle: 'Add Supplier Manually',
          }}
        />
        <Stack.Screen
          name="UploadOrderList"
          options={{
            headerTitle: 'Add Supplier Manually',
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

      {/* Chat */}
      <Stack.Group>
        <Stack.Screen
          name="Chat"
          options={{
            title: '',
          }}
          component={ChatScreen}
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
          name="CompleteUploadInvoice"
          component={CompleteUploadInvoiceScreen}
          options={{
            headerShown: false,
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
        <Stack.Screen
          name="FinalizeOrder"
          component={FinalizeOrderScreen}
          options={{
            headerTitle: 'New Order',
          }}
        />
        <Stack.Screen
          name="DoneOrder"
          component={DoneOrderScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>

      {/* Order */}

      <Stack.Group>
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen
          name="GoodsReceiving"
          component={GoodsReceivingScreen}
          options={{
            headerTitle: 'Check Goods Received',
          }}
        />
        <Stack.Screen
          name="GoodsReceivingIssue"
          component={GoodsReceivingIssue}
          options={{
            headerTitle: 'Tell Us The Issue',
          }}
        />
        <Stack.Screen
          name="GoodsReceivingDone"
          component={GoodsReceivingDone}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: 'modal',
        }}>
        <Stack.Screen name="SelectScreen" component={SelectScreen} />
        <Stack.Screen
          name="CalendarListScreen"
          component={CalendarListScreen}
        />
      </Stack.Group>

      {/* Edit Supplier */}

      <Stack.Group>
        <Stack.Screen
          name="SupplierDetail"
          options={{
            headerTitle: 'Supplier Details',
          }}
          component={SupplierDetailScreen}
        />
        <Stack.Screen
          name="EditSupplierDetail"
          options={{
            headerTitle: 'Edit Supplier Details',
          }}
          component={EditSupplierDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
