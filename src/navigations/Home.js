import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Home from "screens/Home";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Home" component={Home} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index