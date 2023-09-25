import {TouchableOpacity, View, Image} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGlobalStore} from 'stores/global';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import {styled} from 'nativewind';
import AccountPlus from 'assets/images/account-plus.svg';
import useMe from 'hooks/useMe';
import {BackButton} from 'navigations/common';
import useQuery from 'libs/swr/useQuery';

const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');

export default function TeamScreen({navigation}: NativeStackScreenProps<any>) {
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {navigate} = navigation;
  const {user} = useMe();
  const {me} = user || {};
  const {data} = useQuery(`me/outlets/${currentOutlet?.id}/members`);
  const members = data?.records || [];
  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <BackButton
            canGoBack
            goBack={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'MyOutlets'}],
              })
            }
          />
        ),
        headerTitle: currentOutlet?.name,
      });
    }
  }, [currentOutlet, navigation]);

  const renderRole = useCallback(
    ({role, isMine}: {role: string; isMine: boolean}) => {
      if (isMine) return 'You';
      return (
        [
          {role: 'MEMBER', name: 'Staff'},
          {role: 'ADMIN', name: 'Admin'},
          {role: 'OWNER', name: 'Admin'},
        ].find((item: any) => item.role === role)?.name || ''
      );
    },
    [],
  );

  return (
    <Container className="px-0">
      {/* <Divider className="mt-10" /> */}
      <View className="px-5">
        <Text className="font-bold">Outlet</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditOutlet', {outlet: currentOutlet})
          }
          className="flex-row items-center mt-4">
          <View className="flex-row items-center flex-1">
            <Avatar
              name={currentOutlet?.name}
              url={currentOutlet?.photo?.url}
            />
            <Text className="ml-4 text-16 font-medium">
              {currentOutlet?.name}
            </Text>
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
          {members.map((member: any, index: number) => (
            <View className="flex-row items-center mt-4" key={index}>
              <Avatar
                size={40}
                name={member?.fullName}
                url={member?.avatar?.url}
              />
              <View className="ml-4">
                <Text>{member?.fullName}</Text>
                <Text className="text-14 text-gray-600">
                  {renderRole({
                    role: member?.role,
                    isMine: member?.id === me?.id,
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Container>
  );
}
