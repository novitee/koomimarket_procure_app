import {TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {styled} from 'nativewind';
import ContactList from 'components/ContactList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGlobalStore} from 'stores/global';
import useQuery from 'libs/swr/useQuery';
import useMutation from 'libs/swr/useMutation';
import ContactOnKoomiList from './ContactOnKoomiList';
import Toast from 'react-native-simple-toast';
const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');

export default function AddTeamMemberScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const outlet = useGlobalStore(state => state.currentOutlet);
  const {
    data: {records: companyMembers},
  } = useQuery(`me/outlets/${outlet?.id}/companyMembers`) || {};

  const [{loading}, inviteMemberOutlet] = useMutation({
    method: 'POST',
    url: `/api/v1/procure-storefront/me/outlets/${outlet?.id}/members/invite`,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity onPress={handleAdd}>
          <Text className="text-primary">Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function handleAdd() {
    console.log('selectedMembers :>> ', selectedMembers);
    const params = {
      user: {
        email: null,
        mobileCode: '+65',
        mobileNumber: null,
        fullName: '',
        role: 'MEMBER',
      },
    };

    const {data, success, error, message} = await inviteMemberOutlet(params);
    if (!success) {
      Toast.show(error?.message || message, Toast.LONG);
      return;
    }
    navigation.goBack();
  }

  function handleSelectMembers(newMember: any) {
    console.log('newMember :>> ', newMember);
    const index = selectedMembers.findIndex(
      (item: any) => item.phoneNumber === newMember.phoneNumber,
    );

    if (index > -1) {
      setSelectedMembers([
        ...selectedMembers.slice(0, index),
        ...selectedMembers.slice(index + 1),
      ]);
    } else {
      setSelectedMembers([...selectedMembers, newMember]);
    }
  }

  return (
    <Container className="px-0">
      <Text className="text-gray-600 font-bold ml-3">Contacts On Koomi</Text>
      <View className="px-6">
        <ContactOnKoomiList
          onSelect={handleSelectMembers}
          users={companyMembers}
        />
      </View>
      <Divider />
      <Text className="text-gray-600 font-bold ml-3">Invite to Koomi</Text>
      <View className="px-6 flex-1">
        <ContactList onSelect={handleSelectMembers} multiSelect />
      </View>
    </Container>
  );
}
