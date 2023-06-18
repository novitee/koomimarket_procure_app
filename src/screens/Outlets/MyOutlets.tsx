import React, {useCallback} from 'react';
import Container from 'components/Container';
import Text, {Title} from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
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
import {useIsFocused} from '@react-navigation/native';
import {Image} from 'react-native';

import {LogBox} from 'react-native';
import {setGlobal} from 'stores/global';

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

export default function MyOutletsScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {data, mutate} = useQuery(
    'me/outlets?include=photos(url,width,height,filename,contentType,signedKey)',
  );

  useIsFocused();

  const toAddOutlet = useCallback(() => {
    navigation.navigate('AddOutlet', {
      refreshOutlet: mutate,
    });
  }, [mutate, navigation]);

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
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">No Outlets Yet...</Text>
        <Text className="font-light mt-4 text-center">
          Tell us about your outlets!
        </Text>
      </View>
    );
  }, []);

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
      <Title>My Outlets</Title>
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
      <Button className="mt-4" onPress={toAddOutlet}>
        + Create Outlet
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});
