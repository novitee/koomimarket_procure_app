import {View, Text, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Avatar from 'components/Avatar';
import useQuery from 'libs/swr/useQuery';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

export default function SupplierDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {channelId} = route.params || {};
  const {data, mutate} = useQuery([
    channelId ? `channels/${channelId}` : undefined,
    {
      include:
        'supplier(id,photo,name,code,billingAddress,postal,mobileCode,mobileNumber,email,unitNo,manualSupplierId,mobileTelCode,mobileTelNumber)',
    },
  ]);
  const {channel} = data || {};
  const {
    linkedAccountNumber,
    isCustomerPurchased,
    orderMobileCode,
    orderMobileNumber,
    orderNameRepresentative,
    orderCreationMethod,
    emails,
    supplier,
  } = channel || {};
  const {
    email: supplierEmail,
    name: supplierName,
    mobileTelCode: supplierMobileCode,
    mobileTelNumber: supplierMobileNumber,
    manualSupplierId,
  } = supplier || {};

  const imageUrl = supplier?.photo?.url;

  function handleEdit() {
    navigation.navigate('EditSupplierDetail', {
      channel: channel,
    });
  }

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        mutate();
      }
    }, [isFocused]),
  );

  useLayoutEffect(() => {
    if (channel) {
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
  }, [channel, navigation]);

  return (
    <Container>
      <View className="items-center mb-10">
        <Avatar url={imageUrl} size={168} name={supplierName} />
      </View>
      <Text className="text-lg font-semibold">{supplierName}</Text>
      {[
        supplierEmail,
        supplierMobileCode && supplierMobileNumber
          ? `+${supplierMobileCode} ${supplierMobileNumber}`
          : null,
      ]
        .filter(Boolean)
        .map((item, index) => (
          <Text className="mt-2" key={index}>
            {item}
          </Text>
        ))}
      <Text className="text-lg font-semibold mt-5">{`Currently a customer of ${supplierName}`}</Text>
      <Text className="mt-2">
        {isCustomerPurchased
          ? `${['YES', linkedAccountNumber].join(' - ')}`
          : 'NO'}
      </Text>
      {manualSupplierId && (
        <>
          <Text className="text-lg font-semibold mt-5">
            How do you create your orders?
          </Text>
          <Text className="mt-2">{`Name of Representative: ${orderNameRepresentative}`}</Text>
          {orderCreationMethod === 'WHATSAPP' ||
            (orderCreationMethod === 'BOTH' && (
              <Text className="mt-2">{`Phone: +${orderMobileCode} ${orderMobileNumber}`}</Text>
            ))}
          {orderCreationMethod === 'EMAIL' ||
            (orderCreationMethod === 'BOTH' && (
              <Text className="mt-2">{`Email: ${emails?.join(', ')}`}</Text>
            ))}
        </>
      )}
    </Container>
  );
}
