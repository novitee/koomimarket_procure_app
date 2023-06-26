import {TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGlobalStore} from 'stores/global';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import {styled} from 'nativewind';
import AccountPlus from 'assets/images/account-plus.svg';
import useQuery from 'libs/swr/useQuery';
import useMe from 'hooks/useMe';

const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');

export default function TeamScreen({navigation}: NativeStackScreenProps<any>) {
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {navigate} = navigation;
  const {user} = useMe();
  const {me} = user || {};

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({
        headerTitle: currentOutlet?.name || 'Test Outlet',
      });
    }
  }, [currentOutlet, navigation]);

  console.log(`currentOutlet :>>`, currentOutlet);

  const {data} = useQuery(
    currentOutlet?.id ? `me/outlets/${currentOutlet.id}/members` : undefined,
  );

  const {records} = data || {};

  return (
    <Container className="px-0">
      <Divider className="mt-10" />
      <View className="px-5">
        <Text className="font-bold">Outlet</Text>
        <TouchableOpacity
          onPress={() => navigate('EditProfile')}
          className="flex-row items-center mt-4">
          <View className="flex-row items-center flex-1">
            <Avatar name={'Test Outlet'} />
            <Text className="ml-4 text-16 font-medium">{'Test Outlet'}</Text>
          </View>
          <ChevronRightIcon color={colors.chevron} />
        </TouchableOpacity>
      </View>
      <Divider />
      <View className="px-5">
        <Text className="font-bold">Team Members</Text>
        <TouchableOpacity
          onPress={() => navigate('AddTeamMember')}
          className="flex-row items-center mt-4">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <AccountPlus color="white" />
          </View>
          <Text className="ml-4 text-16 font-medium text-primary">
            Add team member
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mt-4">
          <Avatar size={40} name={me?.name} />
          <View className="ml-4">
            <Text>You</Text>
            <Text className="text-14 text-gray-600">Admin</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}
