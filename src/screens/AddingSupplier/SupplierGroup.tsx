import React, {useCallback, useLayoutEffect} from 'react';
import Container from 'components/Container';
import SearchBar from 'components/SearchBar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dummyCover from 'assets/images/dummy_cover.png';
import useSearch from 'hooks/useSearch';
import {
  FlatList,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import Animated from 'react-native-reanimated';
import useQuery from 'libs/swr/useQuery';

function _keyExtractor(item: any, index: number) {
  return `${item.title}-${index}`;
}

function SupplierItem({
  item,
  onPress,
}: {
  item: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const imageUrl = item?.photo ? {uri: item?.photo?.url} : dummyCover;
  const discoverText =
    item.productCountByCategory > 1
      ? `${item.productCountByCategory} products`
      : `${item.productCountByCategory} product`;
  return (
    <TouchableOpacity
      className=" mt-5 w-full border border-gray-D4D4D8"
      onPress={onPress}>
      <Animated.Image
        source={imageUrl}
        className="w-full h-[112px] bg-slate-300 "
        sharedTransitionTag={`supplier-${item.name}`}
      />

      <View className="bg-white h-14 w-14 rounded-full items-center justify-center absolute top-4 left-4">
        <Text className="text-24 font-bold text-primary text-center">
          {(item.name || '').charAt(0)}
        </Text>
      </View>
      <View className="px-4 py-3 border-t border-gray-D4D4D8">
        <Text className="font-semibold">{item.name}</Text>
        <Text className=" text-blue-500">Discover {discoverText}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SupplierGroupScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {group} = route.params || {};
  const {slug} = group || {};
  const {searchString, handleSearch} = useSearch();

  const {data} = useQuery([
    'suppliers',
    {
      first: 100,
      skip: 0,
      searchString,
      fields: 'id,name,slug,productCountByCategory',
      include: 'photo(id,url,width,height,signedKey,filename,contentType)',
      orderBy: {createdAt: 'desc'},
      filter: {status: 'ACTIVE'},
      categoryFilter: {slug: slug},
    },
  ]);
  const {records} = data || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: group.name.toUpperCase(),
    });
  }, [group, navigation]);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold mt-4 text-center">
          No supplier available
        </Text>
      </View>
    );
  }, []);

  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      navigation.navigate('SupplierProfile', {slug: item.slug});
    },
    [navigation],
  );

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

  return (
    <Container className="pt-0">
      <SearchBar onSearch={handleSearch} />
      <FlatList
        className="flex-1"
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}
