import {View, Text, FlatList, TouchableOpacity, Platform} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import Contacts from 'react-native-contacts';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import CheckBox from './CheckBox';
import {PermissionsAndroid} from 'react-native';
import Toast from 'react-native-simple-toast';
const DEFAULT_COUNTRY_CODE = '65';
function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function resolveContact(data: any) {
  const {phoneNumbers, givenName, familyName} = data || {};
  let phoneNumber = phoneNumbers ? phoneNumbers[0]?.number : '';
  phoneNumber = (phoneNumber || '').replace(/[+\-()\s]/g, '');
  if (phoneNumber.length > 8) {
    phoneNumber = phoneNumber.replace(
      new RegExp(`^${DEFAULT_COUNTRY_CODE}`),
      '',
    );
  }

  return {
    name: [givenName, familyName].join(' '),
    mobileCode: DEFAULT_COUNTRY_CODE,
    mobileNumber: phoneNumber,
    phoneNumber: `+${DEFAULT_COUNTRY_CODE}${phoneNumber}`,
  };
}

function ContactItem({
  item,
  onPress,
  multiSelect,
  selected,
}: {
  item?: any;
  onPress?: () => void;
  multiSelect?: boolean;
  selected?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={multiSelect}
      onPress={onPress}
      className="flex-row items-center mt-4">
      <View className="w-14 h-14 bg-gray-E0E0E4 rounded-full items-center justify-center">
        <UserIcon width={24} height={24} color={colors.chevron} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-medium">{item.name}</Text>
        <Text>{item.phoneNumber}</Text>
      </View>
      <View>
        <CheckBox onChange={onPress} defaultValue={selected} />
      </View>
    </TouchableOpacity>
  );
}

function compareMembers(member1: any, member2: any) {
  return (
    member1?.mobileCode === member2?.mobileCode &&
    member1?.mobileNumber === member2?.mobileNumber
  );
}

function filterContactList(
  contacts: any[],
  searchString: string | undefined,
  currentMembers: any[] | undefined,
) {
  if (searchString) {
    contacts = contacts.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(searchString.toLowerCase())
      );
    });
  }
  contacts = contacts.filter((item: any) => {
    return !currentMembers?.find((member: any) => compareMembers(member, item));
  });
  return contacts;
}

export default function ContactList({
  onSelect,
  multiSelect = false,
  currentMembers,
  searchString,
  selectedMembers,
}: {
  onSelect: (item: any) => void;
  multiSelect?: boolean;
  currentMembers?: any[];
  searchString?: string;
  selectedMembers?: any[];
}) {
  const memoRef = useRef<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    if (memoRef.current && !memoRef.current?.contacts) {
      async function getContacts() {
        try {
          if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                buttonPositive: 'Please accept bare mortal',
              },
            );
          }
          const contactsList = await Contacts.getAll();

          let contacts = contactsList.map((item: any) => resolveContact(item));

          return {success: true, data: contacts};
        } catch (error) {
          return {success: false};
        }
      }

      getContacts().then(({data, success}) => {
        if (!success) {
          Toast.show('Failed when get contact', Toast.LONG);
          return;
        }
        memoRef.current.contacts = data;
        const contacts = filterContactList(
          memoRef.current?.contacts || [],
          searchString,
          currentMembers,
        );
        setContacts(contacts);
      });
    }
  }, []);

  useEffect(() => {
    if (!memoRef.current?.contacts) return;

    const contacts = filterContactList(
      memoRef.current?.contacts || [],
      searchString,
      currentMembers,
    );
    setContacts(contacts as any);
  }, [searchString, currentMembers]);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="font-bold mt-4 text-center">No user available</Text>
      </View>
    );
  }, []);

  const handleSelectItem = useCallback(
    (item: any) => {
      onSelect(item);
    },
    [onSelect],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ContactItem
          item={item}
          multiSelect={multiSelect}
          onPress={() => handleSelectItem(item)}
          selected={
            !!selectedMembers?.find((member: any) =>
              compareMembers(member, item),
            )
          }
        />
      );
    },
    [handleSelectItem, multiSelect, selectedMembers],
  );

  return (
    <View ref={memoRef} className="flex-1">
      <FlatList
        data={contacts}
        className="flex-1"
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        extraData={contacts}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
}
