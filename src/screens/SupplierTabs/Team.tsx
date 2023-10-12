import {TouchableOpacity, View, Image} from 'react-native';
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
import {BackButton} from 'navigations/common';
import useQuery from 'libs/swr/useQuery';
import MemberList from './MemberList';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');
import useMe from 'hooks/useMe';

export default function TeamScreen({navigation}: NativeStackScreenProps<any>) {
  const {user} = useMe();
  const {me} = user || {};
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {navigate} = navigation;

  const {data, mutate} = useQuery(
    currentOutlet?.id ? `me/outlets/${currentOutlet?.id}/members` : undefined,
  );
  const members = (data?.records || []).sort((a: any, b: any) => {
    if (a?.companyRole === 'OWNER') return -1;
    if (b?.companyRole === 'OWNER') return 1;
    return 0;
  });

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        mutate();
      }
    }, [isFocused]),
  );

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
  const isMineOwn = members.find(
    (item: any) => item?.id === me?.id && item?.isOutletOwner,
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
        {isMineOwn && (
          <TouchableOpacity
            onPress={() =>
              navigate('AddTeamMember', {
                currentMembers: members,
              })
            }
            className="flex-row items-center mt-4">
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <AccountPlus color="white" />
            </View>
            <Text className="ml-4 text-16 font-medium text-primary">
              Add team member
            </Text>
          </TouchableOpacity>
        )}

        <View className="flex-row items-center mt-4">
          <MemberList members={members} />
        </View>
      </View>
    </Container>
  );
}
