import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import {Title} from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import useMe from 'hooks/useMe';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import {resetAuthData} from 'utils/auth';

const Divider = () => <View className="h-[1px] w-full bg-gray-D1D5DB my-2" />;

export default function SettingsScreen() {
  const {user} = useMe();

  const {me} = user || {};
  return (
    <Container className="px-0">
      <Title className="text-primary px-4">Settings</Title>
      <TouchableOpacity className="flex-row items-center mt-8 p-4">
        <View className="flex-row items-center flex-1">
          <Avatar url={me?.avatar} name={me?.fullName} />
          <Text className="ml-4 text-32 font-medium">{me?.fullName}</Text>
        </View>
        <ChevronRightIcon color="#9CA3AF" />
      </TouchableOpacity>
      <Divider />
      <Button onPress={() => resetAuthData()}>Logout</Button>
    </Container>
  );
}
