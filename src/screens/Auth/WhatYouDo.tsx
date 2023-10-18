import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import Container from 'components/Container';
import ChefIcon from 'assets/images/chef.svg';
import SupplierIcon from 'assets/images/supplier.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SUPPLIER_DASHBOARD_URL} from 'configs/index';
import {Title} from 'components/Text';
import {useGlobalStore} from 'stores/global';
import {setState, useAppStore, IAppStore} from 'stores/app';
import {BackButton} from 'navigations/common';
import {resetAuthData} from 'utils/auth';

const types = [
  {
    icon: <ChefIcon />,
    code: 'buyer',
    label: 'Chef / Manager',
    description: 'I want to order stuff for my restaurant, bar or cafe.',
  },
  {
    icon: <SupplierIcon />,
    code: 'supplier',
    label: 'Supplier / Producer',
    description: 'I want to list and promote my items for ordering.',
  },
];

export default function WhatYouDoScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;
  const mode = useGlobalStore(s => s.authMode) || '';
  const {authRegisterType} = useAppStore();

  useEffect(() => {
    triggerNavigate(authRegisterType);
  }, [navigation, authRegisterType]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => (
        <BackButton
          canGoBack
          goBack={() => {
            resetAuthData();
            setTimeout(() => {
              navigation.navigate('Welcome');
            }, 100);
          }}
        />
      ),
    });
  }, [navigation]);

  function triggerNavigate(registerType: IAppStore['authRegisterType']) {
    if (registerType === 'BUYER') {
      authRegisterType === 'BUYER'
        ? navigate('CreateProfile')
        : setState({authRegisterType: 'BUYER'});
    } else if (registerType === 'SUPPLIER') {
      authRegisterType === 'SUPPLIER'
        ? navigate('GetInTouch')
        : setState({authRegisterType: 'SUPPLIER'});
    }
  }

  function navigateTo(code: string) {
    if (mode === 'login') {
      if (code === 'buyer') {
        setState({authStatus: 'BUYER_COMPLETED'});
      } else if (code === 'supplier') {
        SUPPLIER_DASHBOARD_URL && Linking.openURL(SUPPLIER_DASHBOARD_URL);
      }
    } else if (mode === 'signUp') {
      if (code === 'buyer') {
        triggerNavigate('BUYER');
      } else if (code === 'supplier') {
        triggerNavigate('SUPPLIER');
      }
    }
  }

  return (
    <Container className="justify-center">
      <Title className="text-center">What do you do?</Title>
      <View className="mt-6">
        {types.map(item => {
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigateTo(item.code)}
              className="border-[4px] border-gray-D1D5DB rounded-xl mt-8 p-5">
              <View className="flex-row justify-center items-center">
                {item.icon}
                <View className="flex-1 ml-4">
                  <Text className="font-bold">{item.label}</Text>
                  <Text className="font-medium text-gray-900 mt-2">
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Container>
  );
}
