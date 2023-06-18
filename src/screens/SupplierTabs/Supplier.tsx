import React, {useCallback, useLayoutEffect} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import ShippingIcon from 'assets/images/shipping.svg';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Button from 'components/Button';
import useQuery from 'libs/swr/useQuery';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image} from 'react-native';

import {LogBox} from 'react-native';
import {setGlobal, useGlobalStore} from 'stores/global';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function OutletItem({
  item,
  onPress,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {avatar, name, deliveryAddress} = item || {};
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row rounded-lg bg-gray-E0E0E4/20 p-5 mb-4">
      <Image
        className="w-[72px] h-[72px] bg-gray-400 rounded-lg overflow-hidden"
        source={avatar}
      />
      <View className="flex-1 ml-4">
        <Text className="font-bold text-18">{name || 'Test Outlet 1'}</Text>
        <Text className="font-light mt-2">{deliveryAddress}</Text>
      </View>
    </TouchableOpacity>
  );
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

export default function SupplierScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {data} = useQuery(
    currentOutlet ? `me/outlets/${currentOutlet?.id}` : undefined,
  );

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({
        headerTitle: currentOutlet?.name || 'TEst Outlet',
      });
    }
  }, [currentOutlet, navigation]);

  const toAddSupplier = useCallback(() => {
    navigation.navigate('AddSupplierName');
  }, [navigation]);

  const handleSelectOutlet = useCallback(
    ({item}: {item?: any}) => {
      setGlobal({currentOutlet: item});
      navigation.navigate('SupplierTabs');
    },
    [navigation],
  );

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <ShippingIcon />
        <Text className="font-bold mt-4 text-center">Welcome to Koomi!</Text>
        <Text className="font-light mt-4 text-center">
          Start by adding your suppliers.
        </Text>

        <Button className="mt-4" onPress={toAddSupplier}>
          + Add Supplier
        </Button>
      </View>
    );
  }, [toAddSupplier]);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OutletItem item={item} onPress={() => handleSelectOutlet({item})} />
      );
    },
    [handleSelectOutlet],
  );

  const {records} = data || {};

  return (
    <Container>
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});
