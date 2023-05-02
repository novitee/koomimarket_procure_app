import React, { useContext, useRef, useEffect } from 'react';
import { StatusBar } from 'react-native';
import UserProvider, { UserContext } from 'contexts/user'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from 'navigations/Onboarding'

const Stack = createStackNavigator();

const RootStackScreen = ({}) => {

  // const { me, isLogin } = useContext(UserContext)

  // if (isLogin == null) return null

  const themeConfig = {
    dark: false,
    colors: {
      background: '#fff',
      card: '#fff',
      text: '#000',
      border: '#d9d9d9',
    },
  }

  return (
    <NavigationContainer theme={themeConfig}>
      <Stack.Navigator>
      <Stack.Screen name="OnboardingStack" component={Onboarding} options={{ headerShown: false }} />
        {/* {isLogin ? (
          <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="OnboardingStack" component={OnboardingStack} options={{ headerShown: false }} />
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
function App(props) {
  return (
    <UserProvider client={props.client}>
      <RootStackScreen {...props} isConnected={props.isConnected} reloadNetInfo={props.reloadNetInfo} />
    </UserProvider>
  );
}
export default App