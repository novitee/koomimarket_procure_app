import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Onboarding from "screens/Onboarding";
import SignUp from "screens/Onboarding/SignUp";
import Login from "screens/Onboarding/Login";
import OTP from "screens/Onboarding/OTP";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: true}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: true}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: true}} />
      <Stack.Screen name="OTP" component={OTP} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index