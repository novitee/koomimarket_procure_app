import {View, ScrollView, KeyboardAvoidingView} from 'react-native';
import React, {useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import ContactList from 'components/ContactList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGlobalStore} from 'stores/global';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import clsx from 'libs/clsx';
import Button from 'components/Button';

export default function AddTeamMemberScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const outlet = useGlobalStore(state => state.currentOutlet);
  const {currentMembers} = route.params || {};
  const [{loading}, inviteMemberOutlet] = useMutation({
    method: 'POST',
    url: `me/outlets/${outlet?.id}/members/invites`,
  });

  async function handleAdd() {
    const members = selectedMembers.map(item => ({
      mobileCode: item.mobileCode,
      mobileNumber: item.mobileNumber,
      fullName: item.name,
      role: 'MEMBER',
    }));
    const {data, success, error, message} = await inviteMemberOutlet({members});
    if (!success) {
      Toast.show(error?.message || message, Toast.LONG);
      return;
    }
    navigation.goBack();
  }

  function handleSelectMembers(newMember: any) {
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
      <Text className="text-gray-600 font-bold ml-3">Invite to Koomi</Text>

      <View className="px-6 flex-1">
        <ContactList
          onSelect={handleSelectMembers}
          multiSelect
          currentMembers={currentMembers}
        />
      </View>
      <View className="pt-4 px-5">
        <Button
          onPress={handleAdd}
          loading={loading}
          disabled={selectedMembers.length === 0}
          className={clsx({
            'bg-gray-400 cursor-not-allowed': loading,
          })}>
          Add
        </Button>
      </View>
    </Container>
  );
}
