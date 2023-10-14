import React, {useCallback} from 'react';
import Container from 'components/Container';
import SearchBar from 'components/SearchBar';
import useQuery from 'libs/swr/useQuery';
import useSearch from 'hooks/useSearch';
import dummy from 'assets/images/dummy.png';
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Text from 'components/Text';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Loading from 'components/Loading';
import {SupplierFlatList, useQuerySupplier} from './SupplierGroup';
import {useGlobalStore} from 'stores/global';
function _keyExtractor(item: any, index: number) {
  return `${item.title}-${index}`;
}

function CategoryItem({
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
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {searchString, handleSearch} = useSearch();
  const url = 'app/categories';
  const {data, isLoading} = useQuery([
    url,
    {
      first: 100,
      fields: 'id,name,depth,parent,position,slug,tags',
      include: 'photo(url)',
      orderBy: {position: 'asc'},
      filter: {depth: 0},
      ninOutletId: currentOutlet?.id,
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

  const handleSelectCategory = useCallback(
    ({item}: {item?: any}) => {
      navigation.navigate('SupplierGroup', {category: item});
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <CategoryItem
          item={item}
          onPress={() => handleSelectCategory({item})}
        />
      );
    },
    [handleSelectCategory],
  );

  return (
    <Container className="pt-0">
      <SearchBar onSearch={handleSearch} />
      {searchString ? (
        <SupplierGroup searchString={searchString} navigation={navigation} />
      ) : (
        <FlatList
          className="flex-1"
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          data={records || []}
          extraData={records}
          ListEmptyComponent={isLoading ? null : EmptyComponent}
        />
      )}
      {isLoading && <Loading />}
    </Container>
  );
}

function SupplierGroup({
  searchString,
  navigation,
}: {
  searchString: string;
  navigation: NativeStackNavigationProp<any>;
}) {
  const {data, mutate} = useQuerySupplier(searchString);
  const {records} = data || [];
  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      navigation.navigate('SupplierProfile', {
        slug: item.slug,
      });
    },
    [navigation],
  );
  return (
    <SupplierFlatList
      records={records}
      handleSelectSupplier={handleSelectSupplier}
    />
  );
}
