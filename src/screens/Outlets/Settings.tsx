import {View, TouchableOpacity, Linking, AppState} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
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
import Button from 'components/Button';
const TERM_AND_CONDITIONS_URL = 'https://koomimarket.com/terms-and-conditions';
const PRIVACY_POLICY_URL = 'https://koomimarket.com/privacy-policy';
const REQUEST_DELETE_URL = 'https://koomi.com.sg/purchase/delete-request';

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
  const appState = useRef(AppState.currentState);

  const {user, refresh} = useMe();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        refresh();
      }
    }, [isFocused, refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refresh();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refresh]);

  const {navigate} = navigation;

  const {me, currentCompany} = user || {};

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
    } else if (id === 'privacy_policy') {
      Linking.openURL(PRIVACY_POLICY_URL);
    } else {
      Linking.openURL(TERM_AND_CONDITIONS_URL);
    }
  }

  function onDeleteAccount() {
    showModal({
      title: 'Delete Account Confirmation',
      message: (
        <View>
          <Text className="text-sm text-justify">
            You are requesting to delete your account. This action will erase
            all your data from our database. Please note that it is
            irreversible, and the completion of this process may require up to 7
            business days.
          </Text>
          <Text className="mt-2 text-sm text-justify">
            To complete the account deletion process, you will be redirected to
            our secure deletion page. Please take a moment to review your
            decision carefully.
          </Text>
        </View>
      ),
      onConfirm: () => {
        Linking.openURL(REQUEST_DELETE_URL);
        closeModal();
      },
      modifiers: {
        type: 'confirm',
        confirmTitle: 'Delete',
      },
    });
  }

  return (
    <Container className="px-0">
      <View className="flex-1">
        <Title className="text-primary px-4">Settings</Title>
        <TouchableOpacity
          onPress={() => navigate('EditProfile')}
          className="flex-row items-center mt-8 p-4">
          <View className="flex-row items-center flex-1 ">
            <Avatar url={me?.avatar?.url} name={me?.fullName} />
            <Text className="ml-4 text-32 font-medium flex-1">
              {me?.fullName}
            </Text>
          </View>
          <View>
            <ChevronRightIcon color={colors.chevron} />
          </View>
        </TouchableOpacity>
        <Divider />
        {currentCompany && (
          <>
            <Text className="px-4 font-semibold">Business</Text>
            <TouchableOpacity
              onPress={() => navigate('EditBusiness')}
              className="flex-row items-center mt-2 p-4">
              <View className="flex-row items-center flex-1">
                <Avatar
                  url={currentCompany?.photo?.url}
                  name={currentCompany?.name}
                />
                <Text className="ml-4 text-16 font-medium">
                  {currentCompany?.name}
                </Text>
              </View>
              <ChevronRightIcon color={colors.chevron} />
            </TouchableOpacity>
            <Divider />
          </>
        )}
        <View className="px-4 gap-y-8 mt-1">
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
      </View>

      <View className="px-5 pb-2">
        <Button variant="outline" onPress={onDeleteAccount}>
          Delete Account
        </Button>
      </View>
    </Container>
  );
}
