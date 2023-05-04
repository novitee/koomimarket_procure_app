import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Outlets from "screens/Outlets";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Outlets" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Outlets" component={Outlets} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index