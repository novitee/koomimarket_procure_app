import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VerifyNumber from 'screens/Auth/VerifyNumber';
import WelcomeScreen from 'screens/Auth/Welcome';
import {customScreenOptions} from './common';
import VerifyOTP from 'screens/Auth/VerifyOTP';
import WhatYouDoScreen from 'screens/Auth/WhatYouDo';
import CreateProfile from 'screens/Auth/CreateProfile';
import GetInTouchScreen from 'screens/Auth/GetInTouch';
import WhatYouLikeScreen from 'screens/Auth/WhatYouLike';
import CreateBusinessScreen from 'screens/Auth/CreateBusiness';
import JoinMyTeamScreen from 'screens/Auth/JoinMyTeam';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={customScreenOptions}
      initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="WhatYouDo" component={WhatYouDoScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="GetInTouch" component={GetInTouchScreen} />
      <Stack.Screen name="WhatYouLike" component={WhatYouLikeScreen} />
      <Stack.Screen name="CreateBusiness" component={CreateBusinessScreen} />
      <Stack.Screen name="JoinMyTeam" component={JoinMyTeamScreen} />
    </Stack.Navigator>
  );
}
