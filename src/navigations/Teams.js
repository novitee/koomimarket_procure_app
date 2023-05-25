import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import Teams from "screens/Home/Teams";
import EditProfile from "screens/Home/EditProfile";
import EditOutlet from "screens/Home/EditOutlet";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="Teams" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="Teams" component={Teams} options={{headerShown: true}} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: true}} />
      <Stack.Screen name="EditOutlet" component={EditOutlet} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
export default Index