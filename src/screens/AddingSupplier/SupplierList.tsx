import React, {useCallback} from 'react';
import Container from 'components/Container';
import SearchBar from 'components/SearchBar';
import useQuery from 'libs/swr/useQuery';
import useSearch from 'hooks/useSearch';
import dummy from 'assets/images/dummy.png';
// const dummy = 'assets/images/dummy.png';
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Text from 'components/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
  const imageUrl = item?.photo ? {uri: item?.photo?.url} : dummy;
  return (
    <TouchableOpacity className="h-[96px] mt-2" onPress={onPress}>
      <ImageBackground
        source={imageUrl}
        className="item-center justify-center w-full h-full bg-slate-300">
        <Text className="text-32 font-bold text-white text-center">
          {item.name?.toUpperCase()}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function SupplierListScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  // const {searchString, handleSearch} = useSearch();

  const url = 'app/categories';

  const {data} = useQuery([
    url,
    {
      first: 100,
      // searchString,
      fields: 'id,name,depth,parent,position,slug,tags',
      include: 'photo(url)',
      orderBy: {position: 'asc'},
      filter: {depth: 0},
    },
  ]);
  const {records} = data || {};
  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="font-bold mt-4 text-center">
          No supplier available
        </Text>
      </View>
    );
  }, []);

  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      navigation.navigate('SupplierGroup', {group: item});
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
      {/* <SearchBar onSearch={handleSearch} /> */}

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
