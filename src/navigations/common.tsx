import React, {FunctionComponent, SVGAttributes} from 'react';

import {ParamListBase, RouteProp} from '@react-navigation/native';
import {
  HeaderBackButtonProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack/lib/typescript/src/types';

import {Platform, TouchableOpacity} from 'react-native';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import colors from 'configs/colors';

import QuestionIcon from 'assets/images/question-mark-circle.svg';
import SettingIcon from 'assets/images/cog.svg';
import KoomiLogo from 'assets/images/koomi-logo.svg';

import ChatIcon from 'assets/images/chat.svg';
import ClipBoardListIcon from 'assets/images/clipboard-list.svg';
import UserGroupIcon from 'assets/images/user-group.svg';
import ChatIconActive from 'assets/images/chat_active.svg';
import ClipBoardListIconActive from 'assets/images/clipboard-list_active.svg';
import UserGroupIconActive from 'assets/images/user-group_active.svg';
import ChevronRight from 'assets/images/chevron-left.svg';

export function BackButton({
  canGoBack,
  goBack,
}: HeaderBackButtonProps & {goBack?: () => void}) {
  if (!canGoBack) {
    return null;
  }
  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={goBack}
      className="w-10 h-10 items-center justify-center ">
      <ChevronRight color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  );
}

export const customScreenOptions:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = ({navigation}) => ({
  headerBackVisible: false,
  headerLeft: (props: HeaderBackButtonProps) => (
    <BackButton {...props} goBack={navigation.goBack} />
  ),
  headerShadowVisible: false,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  headerTitle: '',
});

export const mainHeaderTitleStyle: NativeStackNavigationOptions['headerTitleStyle'] =
  {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: colors.primary.DEFAULT,
  };

const barSources: Record<
  string,
  FunctionComponent<SVGAttributes<SVGElement>>
> = {
  supplier: ChatIcon,
  order: ClipBoardListIcon,
  team: UserGroupIcon,
  supplier_active: ChatIconActive,
  order_active: ClipBoardListIconActive,
  team_active: UserGroupIconActive,
};

function BottomTabIcon({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  color: string;
  focused: boolean;
}) {
  const key = `${routeName.toLowerCase()}${focused ? '_active' : ''}`;
  const Icon = barSources[key];
  return <Icon color={color} />;
}

export const customTabScreenOptions:
  | BottomTabNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => BottomTabNavigationOptions)
  | undefined = ({route}) => ({
  headerShadowVisible: false,
  tabBarIcon: (props: any) => (
    <BottomTabIcon {...props} routeName={route.name} />
  ),
  tabBarStyle: {
    ...(Platform.OS === 'android'
      ? {
          paddingBottom: 10,
          paddingTop: 16,
          height: 80,
        }
      : {
          paddingTop: 16,
          height: 95,
        }),
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 10,
    fontFamily: 'Inter',
  },
  headerTitleStyle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
  },
  headerTitleAlign: 'center',
  tabBarActiveTintColor: colors.primary.DEFAULT,
  tabBarInactiveTintColor: colors.gray['6B7280'],
});

export const myOutletsScreenOptions:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = ({navigation}) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('KoomiSupport')}>
      <QuestionIcon />
    </TouchableOpacity>
  ),
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <SettingIcon />
    </TouchableOpacity>
  ),
  headerTitle: () => <KoomiLogo width={156} height={32} />,
});
