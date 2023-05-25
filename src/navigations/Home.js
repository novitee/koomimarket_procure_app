import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TransitionScreenOptions} from "utils/transition"
import MyOutlets from "screens/Home/MyOutlets";
import CreateOutlet from "screens/Home/CreateOutlet";
import Support from "screens/Home/Support";
import Chat from "screens/Home/Chat";
import Settings from "screens/Home/Settings";
import OrderDashboard from "./OrderDashboard";

const Stack = createStackNavigator()

const Index = props => {
  return (
    <Stack.Navigator initialRouteName="OrderDashboard" screenOptions={TransitionScreenOptions}>
      <Stack.Screen name="MyOutlets" component={MyOutlets} options={{headerShown: true}} />
      <Stack.Screen name="CreateOutlet" component={CreateOutlet} options={{headerShown: true}} />
      <Stack.Screen name="Support" component={Support} options={{headerShown: true}} />
      <Stack.Screen name="Chat" component={Chat} options={{headerShown: true}} />
      <Stack.Screen name="Settings" component={Settings} options={{headerShown: true}} />
      <Stack.Screen name="OrderDashboard" component={OrderDashboard} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}
export default Index