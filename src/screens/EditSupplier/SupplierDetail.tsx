import {View, Text, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Avatar from 'components/Avatar';

export default function SupplierDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {item: supplier} = route.params || {};

  const {name, customerOutletName, channelMembers} = supplier || {};
  const supplierChannelMember = channelMembers.find(
    (channelMember: any) => channelMember.objectType === 'SUPPLIER',
  );

  const imageUrl = supplierChannelMember?.photo?.url;
  const {email, fullName, mobileNumber, mobileCode} =
    supplierChannelMember?.user || {};

  const phone = `+${[mobileCode, mobileNumber].join(' ')}`;

  function handleEdit() {
    navigation.navigate('EditSupplierDetail', {
      supplier: supplier,
    });
  }

  useLayoutEffect(() => {
    if (supplier) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <TouchableOpacity onPress={handleEdit}>
            <Text className="text-primary text-lg">Edit</Text>
          </TouchableOpacity>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, navigation]);

  return (
    <Container>
      <View className="items-center mb-10">
        <Avatar url={imageUrl} size={168} name={name} />
      </View>
      <Text className="text-lg font-semibold">{name}</Text>
      <Text className="mt-2">{customerOutletName}</Text>
      <Text className="mt-2">{email}</Text>
      <Text className="mt-2">{phone}</Text>
      <Text className="text-lg font-semibold mt-5">{`Currently a customer of ${name}`}</Text>
      <Text className="mt-2">???</Text>
      <Text className="text-lg font-semibold mt-5">
        How do you create your orders?
      </Text>
      <Text className="mt-2">{`Name of Representative: ${fullName} ???`}</Text>

      <Text className="mt-2">{`Phone: ${phone} ???`}</Text>
      <Text className="mt-2">{`Email: ${email} ???`}</Text>
    </Container>
  );
}
