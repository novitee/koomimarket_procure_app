import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {styled} from 'nativewind';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');

const contacts = [
  {
    name: 'Andrew Novitee',
    phone: '+94567890',
  },
  {
    name: 'Lynn Ong Novitee',
    phone: '+94567890',
  },
  {
    name: 'Ben Novitee',
    phone: '+94567890',
  },
];

const invites = [
  {
    name: 'Owen Novitee',
    phone: '+94567890',
  },
  {
    name: 'Lynn Tan Novitee',
    phone: '+94567890',
  },
  {
    name: 'Joe Novitee',
    phone: '+94567890',
  },
  {
    name: 'Sheena Novitee',
    phone: '+94567890',
  },
];

function ContactItem({data}: any) {
  return (
    <TouchableOpacity className="flex-row items-center mt-4">
      <View className="w-14 h-14 bg-gray-E0E0E4 rounded-full items-center justify-center">
        <UserIcon width={24} height={24} color={colors.chevron} />
      </View>
      <View className="ml-4">
        <Text className="font-semibold">{data.name}</Text>
        <Text>{data.phone}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AddTeamMemberScreen() {
  return (
    <Container className="px-0">
      <Text className="text-gray-600 font-bold ml-3">Contacts On Koomi</Text>
      <View className="px-6">
        {contacts.map(contact => {
          return <ContactItem key={contact.name} data={contact} />;
        })}
      </View>
      <Divider />
      <Text className="text-gray-600 font-bold ml-3">Invite to Koomi</Text>
      <View className="px-6">
        {invites.map(contact => {
          return <ContactItem key={contact.name} data={contact} />;
        })}
      </View>
    </Container>
  );
}
