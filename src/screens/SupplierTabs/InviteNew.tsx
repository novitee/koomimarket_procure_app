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

export default function InviteNew({navigation}: NativeStackScreenProps<any>) {
  return <Container className="px-0">Pending</Container>;
}
