import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Onboarding from "screens/Onboarding";
import SignUp from "screens/Onboarding/SignUp";
import Login from "screens/Onboarding/Login";
import CreateAccount from "screens/Onboarding/CreateAccount";
import SaveBusinessProfile from "screens/Onboarding/SaveBusinessProfile";
import OTP from "screens/Onboarding/OTP";
import Proceed from "screens/Onboarding/Proceed";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: true}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: true}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: true}} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: true}} />
      <Stack.Screen name="SaveBusinessProfile" component={SaveBusinessProfile} options={{headerShown: true}} />
      <Stack.Screen name="OTP" component={OTP} options={{headerShown: true}} />
      <Stack.Screen name="Proceed" component={Proceed} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index