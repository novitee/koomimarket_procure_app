import {View, Text, FlatList, TouchableOpacity, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Contacts from 'react-native-contacts';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import CheckBox from './CheckBox';
import {PermissionsAndroid} from 'react-native';
import Toast from 'react-native-simple-toast';

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function resolveContact(data: any) {
  const {phoneNumbers, givenName, familyName} = data || {};
  return {
    name: [givenName, familyName].join(' '),
    phoneNumber: phoneNumbers ? phoneNumbers[0]?.number : '',
  };
}

function ContactItem({
  item,
  onPress,
  multiSelect,
}: {
  item?: any;
  onPress?: () => void;
  multiSelect?: boolean;
}) {
  const dataItem = resolveContact(item);
  return (
    <TouchableOpacity
      disabled={multiSelect}
      onPress={onPress}
      className="flex-row items-center mt-4">
      <View className="w-14 h-14 bg-gray-E0E0E4 rounded-full items-center justify-center">
        <UserIcon width={24} height={24} color={colors.chevron} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-medium">{dataItem.name}</Text>
        <Text>{dataItem.phoneNumber}</Text>
      </View>
      <View>
        <CheckBox onChange={onPress} />
      </View>
    </TouchableOpacity>
  );
}
export default function ContactList({
  onSelect,
  multiSelect = false,
}: {
  onSelect: (item: any) => void;
  multiSelect?: boolean;
}) {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
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
        setContacts(contactsList);
      } catch (error) {
        Toast.show('Failed when get contact', Toast.LONG);
      }
    }

    getContacts();
  }, []);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="font-bold mt-4 text-center">
          No supplier available
        </Text>
      </View>
    );
  }, []);

  const handleSelectItem = useCallback(
    (item: any) => {
      onSelect(resolveContact(item));
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
        />
      );
    },
    [handleSelectItem, multiSelect],
  );

  return (
    <FlatList
      data={contacts}
      className="flex-1"
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      extraData={contacts}
      ListEmptyComponent={EmptyComponent}
    />
  );
}
