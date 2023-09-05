import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {styled} from 'nativewind';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import ContactList from 'components/ContactList';

const Divider = styled(View, 'h-[1px] w-full bg-gray-300 my-5');

// function ContactItem({data}: any) {
//   return (
//     <TouchableOpacity className="flex-row items-center mt-4">
//       <View className="w-14 h-14 bg-gray-E0E0E4 rounded-full items-center justify-center">
//         <UserIcon width={24} height={24} color={colors.chevron} />
//       </View>
//       <View className="ml-4">
//         <Text className="font-semibold">{data.name}</Text>
//         <Text>{data.phone}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

export default function AddTeamMemberScreen() {
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

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
      {/* <Text className="text-gray-600 font-bold ml-3">Contacts On Koomi</Text>
      <View className="px-6">
        {contacts.map(contact => {
          return <ContactItem key={contact.name} data={contact} />;
        })}
      </View>
      <Divider /> */}
      <Text className="text-gray-600 font-bold ml-3">Invite to Koomi</Text>
      <View className="px-6 flex-1">
        <ContactList onSelect={handleSelectMembers} multiSelect />
      </View>
    </Container>
  );
}
