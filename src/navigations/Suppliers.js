import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Suppliers from "screens/Home/Suppliers";
import SupplierMenu from "screens/Home/SupplierMenu";
import ViewSupplier from "screens/Home/ViewSupplier";
import ViewSupplierProfile from "screens/Home/ViewSupplierProfile";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Suppliers" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Suppliers" component={Suppliers} options={{headerShown: true}} />
      <Stack.Screen name="SupplierMenu" component={SupplierMenu} options={{headerShown: true}} />
      <Stack.Screen name="ViewSupplier" component={ViewSupplier} options={{headerShown: true}} />
      <Stack.Screen name="ViewSupplierProfile" component={ViewSupplierProfile} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index