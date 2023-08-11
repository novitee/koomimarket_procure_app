import React, {useCallback, useLayoutEffect, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Container from 'components/Container';
import Text from 'components/Text';
import ShippingIcon from 'assets/images/shipping.svg';
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
import SearchBar from 'components/SearchBar';
import AddIcon from 'assets/images/plus.svg';

import {LogBox} from 'react-native';
import {setGlobal, useGlobalStore} from 'stores/global';
import Avatar from 'components/Avatar';
import dayjs from 'dayjs';
import colors from 'configs/colors';
import useSearch from 'hooks/useSearch';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function SupplierItem({
  item,
  onPress,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {name, createdAt, lastMessage, channelMembers} = item || {};
  const supplierChannelMember = channelMembers.find(
    (channelMember: any) => channelMember.objectType === 'SUPPLIER',
  );
  const imageUrl = supplierChannelMember?.photo?.url;
  const {type, text} = lastMessage || {};
  const isPendingSetup =
    type === 'group_notification' && text === 'Pending Setup';

  return (
    <View className="flex-row items-center rounded-lg  p-5">
      <Avatar url={imageUrl} size={64} name={name} />
      <View className="flex-1 justify-center ml-4">
        <Text className="font-bold text-18">{name}</Text>
        {!isPendingSetup && (
          <Text className="font-light text-xs mt-2">{`Added at ${dayjs(
            createdAt,
          ).format('MM/DD/YYYY')}`}</Text>
        )}
        {isPendingSetup && (
          <Text className="font-light  text-xs mt-2">
            Pending Setup by Koomi Team
          </Text>
        )}
      </View>
      {!isPendingSetup && (
        <TouchableOpacity hitSlop={10} onPress={onPress} className="p-5">
          <View className="w-8 h-8 items-center justify-center rounded-full border-[3px] border-primary">
            <AddIcon color={colors.primary.DEFAULT} strokeWidth="3" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

export default function SupplierScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {searchString, handleSearch} = useSearch();
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {params} = route || {};
  const isFocused = useIsFocused();

  useEffect(() => {
    if (params?.searchString) {
      handleSearch(params?.searchString);
    }
  }, [params?.searchString]);

  const {data, mutate: refreshChannels} = useQuery([
    '/channels',
    {
      first: 100,
      skip: 0,
      orderby: {
        updatedAt: 'desc',
      },
      filter: {
        status_nin: ['INACTIVE'],
      },
      searchString: searchString,
      include: 'channelMembers(id,objectType,objectId,userId,user,photo)',
    },
  ]);

  useEffect(() => {
    if (isFocused) {
      if (!searchString) {
        refreshChannels();
      } else {
        handleSearch('');
      }
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({headerTitle: currentOutlet?.name});
    }
  }, [currentOutlet, navigation]);

  const toAddSupplier = useCallback(() => {
    navigation.navigate('AddSupplierName');
  }, [navigation]);

  const toSupplierList = useCallback(() => {
    navigation.navigate('SupplierList');
  }, [navigation]);

  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      setGlobal({currentChannel: item});
      navigation.navigate('NewOrder');
    },
    [navigation],
  );

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <ShippingIcon />
        <Text className="font-bold mt-4 text-center">Welcome to Koomi!</Text>
        <Text className="font-light mt-4 text-center">
          Start by adding your suppliers.
        </Text>

        <Button className="mt-4" onPress={toSupplierList}>
          + Add Supplier
        </Button>
      </View>
    );
  }, [toSupplierList]);

  const EmptySearchComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">
          Can't find your supplier?
        </Text>
        <Text className="font-light mt-4 text-center">
          Submit a form and our team will create it for you.
        </Text>

        <Button className="mt-4" onPress={toAddSupplier}>
          + Add Supplier Manually
        </Button>
      </View>
    );
  }, [toAddSupplier]);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <SupplierItem
          item={item}
          onPress={() => handleSelectSupplier({item})}
        />
      );
    },
    [handleSelectSupplier],
  );

  const {records} = data || {};

  return (
    <Container className="pt-4 px-0">
      <SearchBar
        className="px-5"
        onSearch={handleSearch}
        defaultValue={searchString}
      />

      {!!records && records.length > 0 && (
        <Text className="px-3 mt-5 font-semibold">
          Select any supplier to start order
        </Text>
      )}
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={
          searchString ? EmptySearchComponent : EmptyComponent
        }
        ItemSeparatorComponent={_renderItemSeparator}
      />
      <View className="flex-row justify-end px-5">
        <Button
          fullWidth={false}
          className="px-4"
          size="md"
          onPress={toSupplierList}
          variant="outline">
          + Add Supplier
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});
