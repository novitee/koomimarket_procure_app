import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Onboarding from "screens/Onboarding";
import Login from "screens/Onboarding/Login";
import OTP from "screens/Onboarding/OTP";
import SelectTypeYouDo from "screens/Onboarding/SelectTypeYouDo";
import CreateProfile from "screens/Onboarding/CreateProfile";
import SelectTypeYouLike from "screens/Onboarding/SelectTypeYouLike";
import CreateBusinessForm from "screens/Onboarding/CreateBusinessForm";
import JoinTeamForm from "screens/Onboarding/JoinTeamForm";
import SupplierForm from "screens/Onboarding/SupplierForm";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="CreateProfile" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: true}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: true}} />
      <Stack.Screen name="OTP" component={OTP} options={{headerShown: true}} />
      <Stack.Screen name="SelectTypeYouDo" component={SelectTypeYouDo} options={{headerShown: true}} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} options={{headerShown: true}} />
      <Stack.Screen name="SelectTypeYouLike" component={SelectTypeYouLike} options={{headerShown: true}} />
      <Stack.Screen name="CreateBusinessForm" component={CreateBusinessForm} options={{headerShown: true}} />
      <Stack.Screen name="JoinTeamForm" component={JoinTeamForm} options={{headerShown: true}} />
      <Stack.Screen name="SupplierForm" component={SupplierForm} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index