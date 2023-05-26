import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatIcon from "assets/images/chat.svg"
import ClipBoardListIcon from "assets/images/clipboard-list.svg"
import { getFocusedRouteNameFromRoute } from "@react-navigation/native"
import UserGroupIcon from "assets/images/user-group.svg"
import color from 'utils/color';
import H5 from 'components/ui/H5';
import StackSuppliers from "./Suppliers";
import StackOrders from "screens/Home/Orders";
import StackTeams from "./Teams";

const Tab = createBottomTabNavigator();

function MyTabs() {

  function isTabBarVisible(route, initRoute) {
    const routeName = getFocusedRouteNameFromRoute(route) || initRoute
    if (routeName === initRoute) return {}
    return {
      display: "none"
    }
  }

  return (
    <Tab.Navigator
      initialRouteName="Suppliers"
      screenOptions={{
        tabBarActiveTintColor: color.primary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="StackSuppliers"
        component={StackSuppliers}
        options={({route}) => ({
          tabBarStyle: isTabBarVisible(route, "Suppliers"),
          tabBarLabel: ({color}) => (
            <H5 fontWeight={700} style={{color}}>Suppliers</H5>
          ),
          tabBarIcon: ({ color, size }) => (
            <ChatIcon color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="StackOrders"
        component={StackOrders}
        options={({route}) => ({
          tabBarStyle: isTabBarVisible(route, "Orders"),
          tabBarLabel: ({color}) => (
            <H5 fontWeight={700} style={{color}}>Orders</H5>
          ),
          tabBarIcon: ({ color, size }) => (
            <ClipBoardListIcon color={color} width={30} height={30} />
          ),
        })}
      />
      <Tab.Screen
        name="StackTeams"
        component={StackTeams}
        options={({route}) => ({
          tabBarStyle: isTabBarVisible(route, "Teams"),
          tabBarLabel: ({color}) => (
            <H5 fontWeight={700} style={{color}}>Teams</H5>
          ),
          tabBarIcon: ({ color, size }) => (
            <UserGroupIcon color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MyTabs />
  );
}
