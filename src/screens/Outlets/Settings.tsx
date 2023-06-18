import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Text, {Title} from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import LogoutIcon from 'assets/images/login-variant.svg';
import PrivacyIcon from 'assets/images/protect.svg';
import TermsIcon from 'assets/images/document-text.svg';
import useMe from 'hooks/useMe';
import Avatar from 'components/Avatar';
import {resetAuthData} from 'utils/auth';
import colors from 'configs/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useModal} from 'libs/modal';

const Divider = () => <View className="h-[1px] w-full bg-gray-D1D5DB my-2" />;

const menus = [
  {
    id: 'terms_conditions',
    icon: <TermsIcon width={24} color={colors.primary.DEFAULT} />,
    name: 'Terms & Conditions',
  },
  {
    id: 'privacy_policy',
    icon: <PrivacyIcon width={24} color={colors.primary.DEFAULT} />,
    name: 'Privacy Policy',
  },
  {
    id: 'logout',
    icon: <LogoutIcon color={colors.primary.DEFAULT} />,
    name: 'Log Out',
  },
];

export default function SettingsScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {user} = useMe();
  const {navigate} = navigation;
  const {me, currentOutlet} = user || {};
  const {showModal, closeModal} = useModal();

  function handleMenuAction(id: string) {
    if (id === 'logout') {
      showModal({
        title: '',
        message: 'Are you sure you want to log out?',
        onConfirm: () => {
          resetAuthData();
          closeModal();
        },
        modifiers: {
          type: 'confirm',
          confirmTitle: 'Yes',
        },
      });
    } else {
      // navigate('');
    }
  }

  return (
    <Container className="px-0">
      <Title className="text-primary px-4">Settings</Title>
      <TouchableOpacity
        onPress={() => navigate('EditProfile')}
        className="flex-row items-center mt-8 p-4">
        <View className="flex-row items-center flex-1">
          <Avatar url={me?.avatar} name={me?.fullName} />
          <Text className="ml-4 text-32 font-medium">{me?.fullName}</Text>
        </View>
        <ChevronRightIcon color={colors.chevron} />
      </TouchableOpacity>
      <Divider />
      {currentOutlet && (
        <>
          <Text className="px-4">Business</Text>
          <TouchableOpacity
            onPress={() => navigate('EditOutlet')}
            className="flex-row items-center mt-2 p-4">
            <View className="flex-row items-center flex-1">
              <Avatar
                url={currentOutlet?.avatar}
                name={currentOutlet?.fullName}
              />
              <Text className="ml-4 text-32 font-medium">
                {currentOutlet?.fullName}
              </Text>
            </View>
            <ChevronRightIcon color={colors.chevron} />
          </TouchableOpacity>
          <Divider />
        </>
      )}
      <View className="px-4 gap-y-4 mt-4">
        {menus.map(menu => {
          return (
            <TouchableOpacity
              onPress={() => handleMenuAction(menu.id)}
              className="flex-row items-center"
              key={menu.id}>
              <View className="flex-1 flex-row items-center">
                {menu.icon}
                <Text className="font-medium text-sm ml-2">{menu.name}</Text>
              </View>
              <ChevronRightIcon color={colors.chevron} />
            </TouchableOpacity>
          );
        })}
      </View>
    </Container>
  );
}
